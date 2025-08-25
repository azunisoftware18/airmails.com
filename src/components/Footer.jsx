function Footer() {
  return (
    <div className="text-[11px] sm:text-xs flex justify-center items-center py-5 bg-white/10 backdrop-blur-md">
      <span>
        Developed by{" "}
        <strong
          className="cursor-pointer hover:text-gray-800 duration-300"
          onClick={() => window.open("https://azzunique.com", "_blank")}
        >
          Azzunique Software Pvt. Ltd.
        </strong>
      </span>
      <span>•</span>
      <span>&copy; {new Date().getFullYear()}</span>
    </div>
  );
}

export default Footer;
