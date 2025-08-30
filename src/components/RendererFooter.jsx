import React from "react";
import {
  Mail,
  Phone,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const sections = [
  {
    title: "Product",
    links: [
      { name: "Features", to: "/#features" },
      { name: "Pricing", to: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", to: "/about" },
      { name: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [{ name: "Help Center", to: "/help" }],
  },
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://x.com/Azzunique_" },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/azzunique_software",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/azzunisoftware",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://in.linkedin.com/company/azzunique-software",
  },
];

const RendererFooter = () => {
  const year = new Date().getFullYear();
  const pathname = useLocation().pathname;

  const isAuthScreen = pathname === "/register" || pathname === "/login";

  if (isAuthScreen) {
    return (
      <footer
        className={`bg-blue-50/30 py-6 px-4 sm:px-6 ${
          pathname === "/login" ? "-mt-14" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg grid place-items-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Airmailo
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-800 mb-2">
              © {year} Airmailo. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-700">
              <Link
                to="/help"
                className="hover:text-blue-700 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-blue-50/30 text-gray-800">
      <div className="border-t border-blue-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Brand + blurb */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-600 rounded-xl grid place-items-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Airmailo</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The professional email platform trusted by thousands of
                businesses worldwide. Secure, fast, and intelligent email
                management for modern teams.
              </p>

              {/* Contact */}
              <div className="space-y-3 mb-6 text-gray-700">
                <a
                  href="tel:+917412066477"
                  className="flex items-center hover:text-blue-700"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  +91-7412066477
                </a>
                <a
                  href="mailto:info@airmailo.com"
                  className="flex items-center hover:text-blue-700"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  info@airmailo.com
                </a>
              </div>

              {/* Social */}
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-10 h-10 bg-blue-700 rounded-lg grid place-items-center hover:bg-blue-600 transition-colors"
                  >
                    <s.icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav sections */}
            <nav className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sections.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-lg font-semibold mb-4">
                      {group.title}
                    </h3>
                    <ul className="space-y-3">
                      {group.links.map((l) => (
                        <li key={l.name}>
                          {l.to.startsWith("/#") ? (
                            <HashLink
                              smooth
                              to={l.to}
                              className="text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              {l.name}
                            </HashLink>
                          ) : (
                            <Link
                              to={l.to}
                              className="text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              {l.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-blue-100 flex justify-center items-center text-sm text-gray-700">
            <p>© {year} Airmailo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RendererFooter;
