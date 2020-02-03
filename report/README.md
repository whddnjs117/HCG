# 서버 구축 간 디버깅

## 급여관리 - 급여결과출력 - 급여대장양식지정
### 에러
```
[ORA-01502] 인덱스 'HUNELSTANDARD.PK_I_PY0180' 또는 인덱스 분할 영역은 사용할 수 없는 상태입니다.
```

<br>

### 해결
```
Toad form Oracle → HUNELSTANDARD 로그인 → Schema Broswer → Index 조회 → PK_I_PY0170, PK_I_PY0180 Rebuild
```

<hr>
<br>