import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Battery, Wifi, Shield } from "lucide-react";
import { cn } from "../lib/utils";

const PhoneFrame = ({
  children,
  statusBarColor = "bg-gray-900",
  batteryLevel = 100,
  networkStrength = 4,
  threatLevel = 0,
}) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen border overflow-hidden bg-black text-green-400 flex flex-col"
    >
      <div className={cn("flex items-center justify-between text-xs px-2 py-1", statusBarColor)}>
        <span>{time}</span>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Battery className="w-4 h-4" />
            <span>{batteryLevel}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wifi className="w-4 h-4" />
            <span className={networkStrength === 0 ? 'text-red-500' : ''}>
              {networkStrength}
            </span>
          </div>
          <div id="threat-indicator" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>{threatLevel}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="flex justify-around items-center p-2 border-t border-gray-700 bg-gray-900/60">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-800 rounded-md" />
        ))}
      </div>
    </div>
  );
};

PhoneFrame.propTypes = {
  children: PropTypes.node,
  statusBarColor: PropTypes.string,
  batteryLevel: PropTypes.number,
  networkStrength: PropTypes.number,
  threatLevel: PropTypes.number,
};

export default PhoneFrame;
