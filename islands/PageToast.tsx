import { useEffect } from "preact/hooks";
import { toast } from "react-toastify";

type Props = {
  error?: string;
  warn?: string;
  success?: string;
};

export default function ({
  error,
  warn,
  success,
}: Props) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (warn) {
      toast.warn(warn);
    }
    if (success) {
      toast.success(success);
    }
  });

  return null;
}
