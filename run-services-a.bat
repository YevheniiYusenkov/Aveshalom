@echo off
for /l %%a in (4000,1,4009) do (
rem %%a is a variable and starts at a value of 1, steps by 1 and ends at a value of 10
start cmd /k "cd C:\location\to\root\dir & cross-env PORT=%%a ts-node services/service_a/index.ts"
)
