import React from "react";
import { styled } from "@storybook/theming";
import { Input } from "./StyledComponents";
import { MultiSelect } from "./MultiSelect";

const FiltersContainer = styled.div({
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "nowrap",
});

interface ChecklistFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
}

export const ChecklistFilters: React.FC<ChecklistFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedLevels,
  onLevelsChange,
  selectedStatuses,
  onStatusesChange,
}) => {
  const levelOptions = [
    { value: "A", label: "Level A" },
    { value: "AA", label: "Level AA" },
    { value: "AAA", label: "Level AAA" },
  ];

  const statusOptions = [
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
    { value: "not_applicable", label: "Not Applicable" },
    { value: "unknown", label: "Unknown" },
  ];

  return (
    <FiltersContainer>
      <Input
        type="text"
        placeholder="Search guidelines..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <MultiSelect
        options={levelOptions}
        selected={selectedLevels}
        onChange={onLevelsChange}
        placeholder="All Levels"
      />

      <MultiSelect
        options={statusOptions}
        selected={selectedStatuses}
        onChange={onStatusesChange}
        placeholder="All Statuses"
      />
    </FiltersContainer>
  );
};
