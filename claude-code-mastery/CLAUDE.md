# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 저장소 목적

Claude Code의 기능, 워크플로우, 활용법을 직접 실습하고 탐구하는 학습 환경입니다.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 권한 설정

`.claude/settings.local.json`에 정의된 자동 승인 명령어:

```json
{
  "permissions": {
    "allow": ["Bash(npm *)", "Bash(git *)", "Bash(claude *)"]
  }
}
```

`npm`, `git`, `claude` 명령어만 자동 승인됩니다. 그 외 모든 셸 명령어는 사용자 확인이 필요합니다.

## 개발 환경

- **Node.js**: v14.17.0 (EOL — `nvm`으로 v20 LTS 업그레이드 권장)
- **npm**: 6.14.13
- **Git**: 2.23.0
- **Claude Code**: 2.1.138
