import React from "react";

// Footer section
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>BlogHog</p>
      <p>Copyright ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
