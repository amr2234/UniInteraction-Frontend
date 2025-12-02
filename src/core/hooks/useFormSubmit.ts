import { useNavigate } from "react-router-dom";

export const useFormSubmit = (redirectPath: string) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent, callback?: () => void) => {
    e.preventDefault();
    
    if (callback) {
      callback();
    }

    setTimeout(() => {
      navigate(redirectPath);
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    handleSubmit,
    handleCancel,
  };
};
