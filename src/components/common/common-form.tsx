import { Button } from "../ui/button";
import { ControlItem, FormControls } from "./form-controls";

interface CommonFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  buttonText: string;
  formControls: ControlItem[];
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  isButtonDisabled?: boolean;
}

export function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}: CommonFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button disabled={isButtonDisabled} type="submit" className="mt-5 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
