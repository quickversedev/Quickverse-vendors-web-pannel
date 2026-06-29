import { useAuthStore } from "../stores/useAuthStore";
import { CustomButton } from "./common";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";



const Navbar = () => {
  const navigate = useNavigate();
  const { clearSession } = useAuthStore();

  return (
    <header className="flex h-[5%] min-h-16 items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-5">
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Vendor Dashboard-👨‍🍳
      </p>
      
      <CustomButton
        type="button"
        className="px-3 py-2 text-xs"
        onClick={() => {
          clearSession();
          toast.success("Vendor logout ✅");
          navigate("/", { replace: true });
        }}
      >
        Logout
      </CustomButton>
    </header>
  );
};

export default Navbar;