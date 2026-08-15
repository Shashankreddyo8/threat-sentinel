# Threat Sentinel

Build a professional full-stack cybersecurity dashboard for a Final Year Project called "Hybrid CNN + LSTM Based IoT Malware Detection System".

The system detects malware and anomalies in IoT networks using a Hybrid CNN + LSTM deep learning model. Prediction results are stored in Xano backend using the API below.

Use this Xano API as the live backend data source:

POST / GET API Endpoint:
https://x8ki-letl-twmt.n7.xano.io/api:Qnw6FEMs/predictions

The dashboard must fetch and display real-time prediction records from Xano.

Build a dark theme Security Operations Center (SOC) dashboard with a professional cybersecurity look.

Required sections:

Top Summary Cards

Total Network Traffic

Safe Traffic

Malware Detected

Threat Level

Live Prediction Section
Display latest prediction from Xano:

Prediction (ATTACK / BENIGN)

Confidence Score

Source IP

Destination IP

Protocol

Timestamp

Status

Graphs

Attack Trend Over Time (Line Chart)

Attack Type Distribution (Pie Chart)

Daily Threat Detection (Bar Chart)

Prediction History Table
Fetch records from Xano and display:

Time

Source IP

Destination IP

Protocol

Prediction

Confidence Score

Status

Real-Time Alert Section
Show red warning alerts when:
Prediction = ATTACK

Example:
⚠ High Risk Malware Detected

Professional Design Requirements

Dark cybersecurity theme

Modern SOC dashboard style

Security monitoring interface

Red alert highlights

Glowing warning cards

Strong professional presentation quality

Final Year Project review ready

Functional Requirements

Auto-refresh live prediction data from Xano

Display newest attacks first

Highlight ATTACK rows in red

Highlight BENIGN rows in green

Real-time dashboard behavior

Clean responsive design

Make the UI visually impressive, professional, and suitable for final-year project presentation with real backend integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a28a2fa3-fe45-4852-92c5-ca2c230672d0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
