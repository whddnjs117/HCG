# 에러내역

## 데이터베이스
```
Unsafe query: 'Delete' statement without 'where' clears all data in the table
```
- https://www.mkyong.com/mysql/cant-delete-records-in-mysql-workbench/
- setting > Database > General > [] Show a warning before executing potentially unsafe queries >> UnCheck

```sh
SET SQL_SAFE_UPDATES=0;
```