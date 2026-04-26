# forja-restaurants quickstart

## 1) Correr una wave
powershell -ExecutionPolicy Bypass -File .\scripts\forja_restaurants_wave_runner_v2.ps1 -WaveId W2-B03

## 2) Correr repair loop
powershell -ExecutionPolicy Bypass -File .\scripts\forja_restaurants_repair_loop_v2.ps1 -WaveId W2-B03 -MaxAttempts 3

## 3) Shortcut
.\scripts\fr.ps1 -Action wave   -WaveId W2-B03
.\scripts\fr.ps1 -Action repair -WaveId W2-B03 -MaxAttempts 3
.\scripts\fr.ps1 -Action status
