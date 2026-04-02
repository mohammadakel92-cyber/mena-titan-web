export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#1C2333" }}>
        {children}
      </body>
    </html>
  );
}
