import "./style.css";
export const metadata = {
  title: "Demo note | Host Little starter",
  robots: { index: false, follow: false },
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
