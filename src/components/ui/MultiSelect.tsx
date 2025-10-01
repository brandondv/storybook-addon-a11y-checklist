import React, { useState } from "react";
import { styled } from "storybook/theming";

const MultiSelectContainer = styled.div({
  position: "relative",
  display: "inline-block",
});

const MultiSelectButton = styled.button({
  padding: "8px 24px 8px 8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "left",
  minWidth: "120px",
  position: "relative",
  "&:after": {
    content: '"▼"',
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "10px",
  },
});

const MultiSelectDropdown = styled.div<{ isOpen: boolean }>(({ isOpen }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "white",
  border: "1px solid #ddd",
  borderTop: "none",
  borderRadius: "0 0 4px 4px",
  zIndex: 1000,
  display: isOpen ? "block" : "none",
  maxHeight: "200px",
  overflowY: "auto",
}));

const MultiSelectOption = styled.label({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  color: "black",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#afafafff",
  },
});

const MultiSelectCheckbox = styled.input({
  marginRight: "8px",
});

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1)
      return options.find((opt) => opt.value === selected[0])?.label || "";
    return `${selected.length} selected`;
  };

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <MultiSelectContainer>
      <MultiSelectButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {getDisplayText()}
      </MultiSelectButton>
      <MultiSelectDropdown isOpen={isOpen}>
        {options.map((option) => (
          <MultiSelectOption key={option.value}>
            <MultiSelectCheckbox
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggleOption(option.value)}
            />
            {option.label}
          </MultiSelectOption>
        ))}
      </MultiSelectDropdown>
    </MultiSelectContainer>
  );
};
