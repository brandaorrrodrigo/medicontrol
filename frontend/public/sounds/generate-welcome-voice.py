#!/usr/bin/env python3
"""
Gerador de Voz de Boas-Vindas para MedicControl
Requer: pip install gtts
"""

from gtts import gTTS
import os

def generate_welcome_voice():
    text = "Bem-vindo ao Sistema Medic Control de Administração de Medicamentos"

    print("🎙️  Gerando voz de boas-vindas...")
    print(f"📝 Texto: {text}")

    # Cria o áudio com voz feminina em português brasileiro
    tts = gTTS(text=text, lang='pt-br', slow=False)

    # Salva o arquivo
    output_file = "welcome-voice.mp3"
    tts.save(output_file)

    print(f"✅ Arquivo gerado: {output_file}")
    print(f"📊 Tamanho: {os.path.getsize(output_file)} bytes")
    print("\n🎵 Pronto! Agora baixe um som de porta automática abrindo.")

if __name__ == "__main__":
    try:
        generate_welcome_voice()
    except ImportError:
        print("❌ Erro: gTTS não está instalado")
        print("📦 Instale com: pip install gtts")
        print("\nOu use alternativas online:")
        print("- https://elevenlabs.io")
        print("- https://ttsmp3.com")
