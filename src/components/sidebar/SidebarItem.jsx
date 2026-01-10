import { NavLink } from "react-router-dom"

export default function SidebarItem({ to, label, icon: Icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `
        flex items-center gap-4
        px-4 py-5 rounded-xl
        text-lg font-medium
        transition-colors duration-200
        ${
          isActive
            ? "bg-[#249E94]/20 text-white"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }
      `
      }
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </NavLink>
  )
}
