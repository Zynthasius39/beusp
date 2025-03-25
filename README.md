<p float="left">
  <img src="public/static/beu.svg" width="100px"/>
  <img src="https://github.com/user-attachments/assets/3e07f85b-7dbd-4181-b2e9-ae61f249006c" />
</p>

## Student Information System
## Tələbə Məlumat Sistemi

### Individual Assignment for Multi Platform Programming


![image1](https://github.com/user-attachments/assets/6701b74b-d888-4620-8217-a3a4c1a77bca)
![image2](https://github.com/user-attachments/assets/580adcbd-659b-44f8-9207-d8c5e2de11a1)

### I prefer the old logo. Sorry, hated the new one. Having a deep meaning doesn't mean it's a good logo.

## Getting started
- Starting a dev environment:
```bash
git clone https://github.com/Zynthasius39/beusp
cd beusp
bun install
bun run dev
```
- Set-up the proxy server:
```bash
git clone https://github.com/Zynthasius39/beusp_proxy
cd beusp_proxy
python3 -m venv .venv
#------------------------------------------------------#
source .venv/bin/activate         # Linux / macOS
.venv\Scripts\activate.ps1        # Windows (Powershell)
.venv\bin\activate                # Windows (CMD)
#------------------------------------------------------#
python3 -m pip install -r requirements.txt
```
- Start the proxy server (deployment):
```bash
# Linux/macOS only
uwsgi --http 0.0.0.0:8000 --master -p 4 -w main:app
```
- If you want a development server instead:
```bash
python3 src/main.py
```
- Enable Swagger:
```bash
export SWAGGER_ENABLED=true      # Linux / macOS
$Env:SWAGGER_ENABLED = "true"    # Windows (Powershell)
set SWAGGER_ENABLED=true         # Windows (CMD)
```
- Enable Offline mode:
```bash
export TMSAPI_OFFLINE=true      # Linux / macOS
$Env:TMSAPI_OFFLINE = "true"    # Windows (Powershell)
set TMSAPI_OFFLINE=true         # Windows (CMD)
```
- Enable Debugging:
```bash
export DEBUG=true      # Linux / macOS
$Env:DEBUG = "true"    # Windows (Powershell)
set DEBUG=true         # Windows (CMD)
```
```diff
# Change host address for your deployment
/src/Api.ts (Line 1)
+ When offline mode is enabled, no request is being made to root server.
- You need to have the proxy server running!
```
