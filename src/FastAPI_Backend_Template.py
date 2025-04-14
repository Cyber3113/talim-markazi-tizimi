"""
FastAPI Backend Template for O'quv Markazi Tizimi

This file provides a template for creating a FastAPI backend for the educational center management system.
Save this file separately and run it using Python with FastAPI installed.

Installation:
    pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart

Run the server:
    uvicorn FastAPI_Backend_Template:app --reload
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from typing import List, Optional
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from enum import Enum

# Secret key for JWT tokens - in production, use a secure random secret
SECRET_KEY = "12345678901234567890123456789012"  # 32-character secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
DATABASE_URL = "sqlite:///./educational_center.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# CORS settings to allow frontend to connect
origins = [
    "http://192.168.1.4:8080",
    "http://192.168.1.4:8000",
    "http://localhost:8080",
    "http://localhost:8000",
    "*"  # Development uchun barcha domainlarga ruxsat berish
]

# Define database models
class UserRole(str, Enum):
    CEO = "CEO"
    Mentor = "Mentor"
    Admin = "Admin"
    Student = "Student"

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String)
    phone = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    
    # Relationships
    student = relationship("StudentDB", back_populates="user", uselist=False)

class GroupDB(Base):
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"))
    schedule = Column(String)
    price = Column(Integer, nullable=True)
    
    # Relationships
    students = relationship("StudentDB", back_populates="group")

class StudentDB(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    parent_phone = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    coins = Column(Integer, default=0)
    
    # Relationships
    user = relationship("UserDB", back_populates="student")
    group = relationship("GroupDB", back_populates="students")
    attendance = relationship("AttendanceDB", back_populates="student")
    scores = relationship("ScoreDB", back_populates="student")

class AttendanceDB(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    present = Column(Boolean, default=False)
    student_id = Column(Integer, ForeignKey("students.id"))
    
    # Relationships
    student = relationship("StudentDB", back_populates="attendance")

class ScoreDB(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    value = Column(Integer)
    student_id = Column(Integer, ForeignKey("students.id"))
    description = Column(String, nullable=True)
    
    # Relationships
    student = relationship("StudentDB", back_populates="scores")

# Pydantic models for API
class Token(BaseModel):
    access: str
    refresh: str
    user: dict

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    username: str
    role: UserRole
    name: str
    phone: Optional[str] = None
    age: Optional[int] = None
    email: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    parent_phone: Optional[str] = None
    age: Optional[int] = None
    group_id: Optional[int] = None
    coins: Optional[int] = 0

class StudentCreate(StudentBase):
    user_id: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None

class Student(StudentBase):
    id: int
    user_id: Optional[int] = None
    
    class Config:
        orm_mode = True

class GroupBase(BaseModel):
    name: str
    mentor_id: int
    schedule: str
    price: Optional[int] = None

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    id: int
    students: List[Student] = []
    
    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    date: str
    present: bool
    student_id: int

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    
    class Config:
        orm_mode = True

class ScoreBase(BaseModel):
    date: str
    value: int
    student_id: int
    description: Optional[str] = None

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    
    class Config:
        orm_mode = True

class LoginData(BaseModel):
    username: str
    password: str

# Helper functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Create FastAPI app
app = FastAPI(title="O'quv Markazi API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Add initial data if database is empty
def init_db():
    db = SessionLocal()
    # Check if we already have users
    user_count = db.query(UserDB).count()
    if user_count == 0:
        # Create default admin user
        hashed_password = get_password_hash("admin123")
        admin = UserDB(
            username="admin",
            hashed_password=hashed_password,
            name="Admin User",
            role=UserRole.CEO
        )
        db.add(admin)
        
        # Add some test mentors
        mentor1 = UserDB(
            username="mentor1",
            hashed_password=get_password_hash("mentor123"),
            name="Mentor One",
            role=UserRole.Mentor,
            phone="+998901234567"
        )
        db.add(mentor1)
        
        # Commit to get the IDs
        db.commit()
    db.close()

# Initialize database with some data
init_db()

# API routes
@app.post("/api/auth/login/", response_model=Token)
async def login_for_access_token(form_data: LoginData, db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    # Convert to dict for response
    user_data = {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "role": user.role,
        "phone": user.phone,
        "email": user.email,
        "address": user.address,
        "age": user.age
    }
    
    return {
        "access": access_token,
        "refresh": refresh_token,
        "user": user_data
    }

@app.post("/api/token/refresh/")
async def refresh_token(token: dict, db: Session = Depends(get_db)):
    refresh_token = token.get("refresh")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing refresh token"
        )
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = get_user(db, username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    access_token = create_access_token(data={"sub": username})
    return {"access": access_token}

@app.get("/api/auth/user/", response_model=User)
async def get_current_user_info(current_user: UserDB = Depends(get_current_user)):
    return current_user

# Group routes
@app.get("/api/group/", response_model=List[Group])
async def get_groups(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    groups = db.query(GroupDB).all()
    return groups

@app.get("/api/group/{group_id}/", response_model=Group)
async def get_group(group_id: int, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    group = db.query(GroupDB).filter(GroupDB.id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@app.post("/api/group/", response_model=Group)
async def create_group(group: GroupCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if current_user.role not in [UserRole.CEO, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Not authorized to create groups")
    
    # Check if mentor exists
    mentor = db.query(UserDB).filter(UserDB.id == group.mentor_id).first()
    if not mentor or mentor.role != UserRole.Mentor:
        raise HTTPException(status_code=400, detail="Invalid mentor ID")
    
    db_group = GroupDB(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

# Student routes
@app.get("/api/student/", response_model=List[Student])
async def get_students(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    # For mentors, only return students in their groups
    if current_user.role == UserRole.Mentor:
        mentor_groups = db.query(GroupDB).filter(GroupDB.mentor_id == current_user.id).all()
        group_ids = [group.id for group in mentor_groups]
        students = db.query(StudentDB).filter(StudentDB.group_id.in_(group_ids)).all()
    else:
        students = db.query(StudentDB).all()
    return students

@app.get("/api/student/{student_id}/", response_model=Student)
async def get_student(student_id: int, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if mentor is authorized to view this student
    if current_user.role == UserRole.Mentor:
        mentor_groups = db.query(GroupDB).filter(GroupDB.mentor_id == current_user.id).all()
        group_ids = [group.id for group in mentor_groups]
        if student.group_id not in group_ids:
            raise HTTPException(status_code=403, detail="Not authorized to view this student")
    
    return student

@app.post("/api/student/", response_model=Student)
async def create_student(student: StudentCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if current_user.role not in [UserRole.CEO, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Not authorized to create students")
    
    # Create new student
    db_student = StudentDB(
        name=student.name,
        address=student.address,
        phone=student.phone,
        parent_phone=student.parent_phone,
        age=student.age,
        group_id=student.group_id,
        coins=student.coins or 0
    )
    
    # If username and password provided, create user account
    if student.username and student.password:
        # Check if username already exists
        existing_user = get_user(db, student.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Create user account
        hashed_password = get_password_hash(student.password)
        db_user = UserDB(
            username=student.username,
            hashed_password=hashed_password,
            name=student.name,
            role=UserRole.Student
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Link student to user
        db_student.user_id = db_user.id
    
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# Attendance routes
@app.get("/api/attendance/", response_model=List[Attendance])
async def get_attendance(
    student_id: Optional[int] = None, 
    group_id: Optional[int] = None,
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_user)
):
    query = db.query(AttendanceDB)
    
    if student_id:
        query = query.filter(AttendanceDB.student_id == student_id)
    
    if group_id:
        students = db.query(StudentDB).filter(StudentDB.group_id == group_id).all()
        student_ids = [student.id for student in students]
        query = query.filter(AttendanceDB.student_id.in_(student_ids))
    
    attendance = query.all()
    return attendance

@app.post("/api/attendance/", response_model=Attendance)
async def record_attendance(
    attendance: AttendanceCreate, 
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_user)
):
    # Check if student exists
    student = db.query(StudentDB).filter(StudentDB.id == attendance.student_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    # For mentors, check if they can record attendance for this student
    if current_user.role == UserRole.Mentor:
        student_group = db.query(GroupDB).filter(GroupDB.id == student.group_id).first()
        if not student_group or student_group.mentor_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to record attendance for this student")
    
    # Create attendance record
    db_attendance = AttendanceDB(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

# Score routes
@app.get("/api/scores/", response_model=List[Score])
async def get_scores(
    student_id: Optional[int] = None,
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_user)
):
    query = db.query(ScoreDB)
    
    if student_id:
        query = query.filter(ScoreDB.student_id == student_id)
    
    scores = query.all()
    return scores

@app.post("/api/scores/", response_model=Score)
async def add_score(
    score: ScoreCreate, 
    coins: Optional[int] = None,
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_user)
):
    # Check if student exists
    student = db.query(StudentDB).filter(StudentDB.id == score.student_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    # For mentors, check if they can add scores for this student
    if current_user.role == UserRole.Mentor:
        student_group = db.query(GroupDB).filter(GroupDB.id == student.group_id).first()
        if not student_group or student_group.mentor_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to add scores for this student")
    
    # Create score record
    db_score = ScoreDB(**score.dict())
    db.add(db_score)
    
    # Update student coins if provided
    if coins:
        student.coins = (student.coins or 0) + coins
    
    db.commit()
    db.refresh(db_score)
    return db_score

# Top students endpoint - authentication dependency qo'shildi
@app.get("/api/student/top/", response_model=List[Student])
async def get_top_students(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)  # Faqat current_user qoldiramiz
):
    # Get students ordered by coins
    top_students = db.query(StudentDB).order_by(StudentDB.coins.desc()).limit(limit).all()
    return top_students

if __name__ == "__main__":
    try:
        import uvicorn
        print("Starting the server...")
        uvicorn.run("FastAPI_Backend_Template:app", host="192.168.1.4", port=8000, reload=True)
    except ImportError:
        print("Error: uvicorn is not installed. Please install it using:")
        print("pip install uvicorn")
    except Exception as e:
        print(f"Error starting the server: {str(e)}")
        print("\nMake sure you have installed all required dependencies:")
        print("pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart")
