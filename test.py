from passlib.hash import bcrypt

user_kiritgan_parol = "mentor123"
saqlangan_hash = "$2b$12$gUwND2nvvljoLy2Jl9JhHuqnqa/I00hIplhQCOnKb3D97x4QPu.rG"

if bcrypt.verify(user_kiritgan_parol, saqlangan_hash):
    print("✅ Parol to'g'ri")
else:
    print("❌ Parol noto'g'ri")
