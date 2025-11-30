"""
Script de TTS usando XTTS v2 (Coqui)
Gera áudio de alta qualidade em português brasileiro
"""

import sys
import os
import torch
from TTS.api import TTS
import json

# Configurar device (CUDA se disponível)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Cache do modelo (não recarregar a cada chamada)
_model_cache = None

def get_tts_model():
    """Carrega ou retorna o modelo XTTS v2 do cache"""
    global _model_cache

    if _model_cache is None:
        print("🔄 Carregando modelo XTTS v2...", file=sys.stderr)
        # Modelo multilíngue com suporte a português
        _model_cache = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
        print(f"✅ Modelo carregado no {device}", file=sys.stderr)

    return _model_cache

def generate_speech(text: str, output_path: str, language: str = "pt", speaker_wav: str = None):
    """
    Gera áudio a partir de texto

    Args:
        text: Texto para sintetizar
        output_path: Caminho para salvar o áudio
        language: Idioma (pt para português)
        speaker_wav: Arquivo de áudio para clonar voz (opcional)
    """
    try:
        tts = get_tts_model()

        # Se não tiver arquivo de voz para clonar, usa voz padrão feminina
        if speaker_wav and os.path.exists(speaker_wav):
            print(f"🎤 Usando voz de referência: {speaker_wav}", file=sys.stderr)
            tts.tts_to_file(
                text=text,
                file_path=output_path,
                speaker_wav=speaker_wav,
                language=language
            )
        else:
            # Usar voz padrão do modelo
            print("🎤 Usando voz padrão do modelo", file=sys.stderr)
            tts.tts_to_file(
                text=text,
                file_path=output_path,
                language=language
            )

        print(f"✅ Áudio gerado: {output_path}", file=sys.stderr)
        return True

    except Exception as e:
        print(f"❌ Erro ao gerar áudio: {str(e)}", file=sys.stderr)
        return False

def main():
    """Função principal - recebe argumentos via linha de comando"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "error": "Uso: python tts_xtts.py <texto> <output_path> [speaker_wav]"
        }))
        sys.exit(1)

    text = sys.argv[1]
    output_path = sys.argv[2]
    speaker_wav = sys.argv[3] if len(sys.argv) > 3 else None

    # Criar diretório de saída se não existir
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Gerar áudio
    success = generate_speech(text, output_path, language="pt", speaker_wav=speaker_wav)

    # Retornar resultado como JSON
    result = {
        "success": success,
        "output_path": output_path,
        "text_length": len(text)
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
