import React from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
    search: Search,
    warning: AlertTriangle,
    inbox: Inbox,
};

function NotFound({
    title = "Not Found",
    message = "We couldn't find what you were looking for.",
    icon = "search",
    showBackButton = true
}) {
    const navigate = useNavigate();
    const IconComponent = iconMap[icon] || Search;

    return (
        <motion.div
            className="flex flex-col items-center justify-center text-center py-16 px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-blue-100 p-6 rounded-full"
            >
                <IconComponent className="w-12 h-12 text-blue-600" />
            </motion.div>

            <motion.h2
                className="mt-6 text-2xl font-semibold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {title}
            </motion.h2>

            <motion.p
                className="mt-2 text-gray-600 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {message}
            </motion.p>

            {showBackButton && (
                <motion.button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Go Back
                </motion.button>
            )}
        </motion.div>
    );
}

export default NotFound;
