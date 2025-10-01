import React from "react";
import { styled } from "storybook/theming";
import { Input } from "./StyledComponents";

const FiltersContainer = styled.div({
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "wrap",
});

const FilterLabel = styled.label({
  fontSize: "14px",
  fontWeight: "500",
});

interface ChecklistFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  isReadOnly: boolean;
  MultiSelectComponent: React.FC<{
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
  }>;
}

export const ChecklistFilters: React.FC<ChecklistFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedLevels,
  onLevelsChange,
  selectedStatuses,
  onStatusesChange,
  isReadOnly,
  MultiSelectComponent,
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

      <MultiSelectComponent
        options={levelOptions}
        selected={selectedLevels}
        onChange={onLevelsChange}
        placeholder="All Levels"
      />

      <MultiSelectComponent
        options={statusOptions}
        selected={selectedStatuses}
        onChange={onStatusesChange}
        placeholder="All Statuses"
      />

      {isReadOnly && (
        <div
          style={{
            color: "#856404",
            backgroundColor: "#fff3cd",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          ⚠️ Read-only mode (server unavailable)
        </div>
      )}
    </FiltersContainer>
  );
};
