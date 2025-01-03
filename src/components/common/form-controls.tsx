import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type ControlItem = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  componentType: "input" | "select" | "textarea";
  options?: { id: string; label: string }[];
};

type FormControlsProps = {
  formControls: ControlItem[];
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
};

export function FormControls({
  formControls = [],
  formData,
  setFormData,
}: FormControlsProps) {
  function renderComponentByType(getControlItem: ControlItem) {
    const currentControlItemValue = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        return (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
      default:
        return null;
    }
  }
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}
