import toast from "react-hot-toast";

interface ToastProps {
  text: string;
  title?: string;
  action?: () => void;
}

const successToast = ({ text, title, action }: ToastProps): void => {
  const content = title ? `${title}\n${text}` : text;

  toast.success(content, {
    duration: 4000,
    style: {
      border: "1px solid #4caf50",
      padding: "16px",
      color: "#4caf50",
    },
  });

  if (action) {
    setTimeout(action, 4000); // Eksekusi `action` setelah toast hilang
  }
};

const errorToast = ({ text, title, action }: ToastProps): void => {
  const content = title ? `${title}\n${text}` : text;

  toast.error(content, {
    duration: 4000,
    style: {
      border: "1px solid #f44336",
      padding: "16px",
      color: "#f44336",
    },
  });

  if (action) {
    setTimeout(action, 4000); // Eksekusi `action` setelah toast hilang
  }
};

export { successToast, errorToast };
