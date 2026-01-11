# Event Management Frontend

This is the **React frontend** for the Event Management System.  
It allows attendees to view events, register, cancel registration, and see ticket status.  
Admins can create events, view attendees, and export reports.

---

## **Technologies Used**

- React
- TailwindCSS
- Axios
- React Router DOM
- QR Code (qrcode.react, html5-qrcode)
- XLSX for Excel export
- Lucide React (icons)

---

## **Setup & Installation**

**1. Install dependencies**

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom qrcode.react xlsx lucide-react html5-qrcode

to run frontend: npm run dev