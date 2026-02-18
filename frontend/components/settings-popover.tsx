"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, Moon, Sun, Bell } from "lucide-react";

export function SettingsPopover() {
  const [isDark, setIsDark] = React.useState(false);
  const [notifications, setNotifications] = React.useState(false);

  React.useEffect(() => {
    // Check saved theme preference (default to dark if not set)
    const savedTheme = localStorage.getItem("llm-council-theme");
    const isDarkMode = savedTheme === "dark" || savedTheme === null;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check saved notification preference (default to on if not set)
    const savedNotifications = localStorage.getItem("llm-council-notifications");
    setNotifications(savedNotifications !== "false");
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked);
    localStorage.setItem("llm-council-theme", checked ? "dark" : "light");
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem("llm-council-notifications", checked ? "true" : "false");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton tooltip="Settings">
          <Settings />
          <span>Settings</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="w-56">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Settings</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={toggleNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="text-sm">Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
