export default function Footer() {
  return (
    <footer className="w-full bg-footer-black py-6 text-center text-sm text-white/70">
      <p>
        &copy; {new Date().getFullYear()} Asian Paralympic Committee. All
        rights reserved.
      </p>
    </footer>
  );
}
