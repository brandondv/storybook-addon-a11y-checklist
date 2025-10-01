import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useStorybookApi, useStorybookState } from "storybook/manager-api";
import { styled } from "storybook/theming";
import type {
  ChecklistFile,
  ChecklistItem,
  WCAGGuideline,
  ChecklistStatus,
  WCAGLevel,
} from "../types";
import { getGuidelinesByVersion } from "../data/wcag-guidelines";
import { ChecklistClientManager } from "../utils/client-manager";
import { DEFAULT_CONFIG } from "../constants";

interface TabProps {
  active: boolean;
}

interface FilterState {
  search: string;
  level: (WCAGLevel | "all")[];
  status: (ChecklistStatus | "all")[];
}

const STATUS_COLORS = {
  pass: "#28a745",
  fail: "#dc3545",
  not_applicable: "#6c757d",
  unknown: "#ffc107",
} as const;

const LEVEL_COLORS = {
  A: "#00b894",    // Dark green
  AA: "#00cec9",   // Medium green  
  AAA: "#55efc4",  // Light green
} as const;

const STATUS_LABELS = {
  pass: "Pass",
  fail: "Fail",
  not_applicable: "N/A",
  unknown: "Unknown",
} as const;

const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "16px",
  height: "100%",
  overflow: "auto",
  boxSizing: "border-box",
}));

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const Title = styled.h1({
  margin: 0,
  fontSize: "20px",
  fontWeight: 600,
});

const ButtonGroup = styled.div({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

const Badge = styled.span<{
  variant?: "warning" | "success" | "danger" | "secondary";
  level?: WCAGLevel;
}>(({ variant, level, theme }) => {
  let colors = { bg: "#6c757d", color: "white" };
  
  if (level) {
    colors = { bg: LEVEL_COLORS[level], color: "white" };
  } else if (variant) {
    const variantColors = {
      warning: { bg: "#ffc107", color: "#212529" },
      success: { bg: "#28a745", color: "white" },
      danger: { bg: "#dc3545", color: "white" },
      secondary: { bg: "#6c757d", color: "white" },
    };
    colors = variantColors[variant];
  }

  return {
    background: colors.bg,
    color: colors.color,
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  };
});

const Button = styled.button<{
  variant: "primary" | "secondary";
  disabled?: boolean;
}>(({ variant, disabled }) => ({
  background: disabled
    ? "#6c757d"
    : variant === "primary"
      ? "#007bff"
      : "#6c757d",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "14px",
  fontWeight: 500,
  opacity: disabled ? 0.6 : 1,
}));

const Input = styled.input({
  width: "100%",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
});

const Select = styled.select({
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
});

const GuidelineCard = styled.div(({ theme }) => ({
  border: `1px solid ${theme.color.border}`,
  borderRadius: "8px",
  marginBottom: "12px",
  padding: "16px",
  background: theme.background.content,
}));

const MultiSelectContainer = styled.div({
  position: "relative",
  display: "inline-block",
});

const MultiSelectButton = styled.button({
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  backgroundColor: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: "120px",
  justifyContent: "space-between",
});

const MultiSelectDropdown = styled.div<{ isOpen: boolean }>(({ isOpen }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  border: "1px solid #ddd",
  borderTop: "none",
  borderRadius: "0 0 4px 4px",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 1000,
  display: isOpen ? "block" : "none",
}));

const MultiSelectOption = styled.label({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const SummaryContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "12px",
  marginBottom: "16px",
});

const SummaryBlock = styled.div<{
  color: string;
  backgroundColor: string;
}>(({ color, backgroundColor }) => ({
  backgroundColor,
  color,
  padding: "12px 16px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: 600,
  fontSize: "14px",
  border: `2px solid ${color}20`,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
}));

const SummaryLabel = styled.div({
  fontSize: "12px",
  fontWeight: 500,
  opacity: 0.8,
});

const SummaryValue = styled.div({
  fontSize: "18px",
  fontWeight: 700,
});

interface MultiSelectProps<T> {
  options: { value: T; label: string }[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder: string;
}

const MultiSelect = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
}: MultiSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (optionValue: T) => {
    if (optionValue === "all" as T) {
      // If "all" is clicked, clear all other selections and select only "all"
      onChange(["all" as T]);
    } else {
      // Remove "all" from selection when specific item is selected
      const newValue = value.includes("all" as T) ? [] : value.filter(v => v !== "all" as T);
      
      if (newValue.includes(optionValue)) {
        const filtered = newValue.filter(v => v !== optionValue);
        onChange(filtered.length === 0 ? ["all" as T] : filtered);
      } else {
        onChange([...newValue, optionValue]);
      }
    }
  };

  const selectedLabels = value.includes("all" as T) 
    ? ["All"] 
    : value.map(v => options.find(o => o.value === v)?.label).filter(Boolean);

  return (
    <MultiSelectContainer>
      <MultiSelectButton onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedLabels.join(", ") || placeholder}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </MultiSelectButton>
      <MultiSelectDropdown isOpen={isOpen}>
        {options.map((option) => (
          <MultiSelectOption key={option.value}>
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            />
            {option.label}
          </MultiSelectOption>
        ))}
      </MultiSelectDropdown>
    </MultiSelectContainer>
  );
};

export const Tab: React.FC<TabProps> = ({ active }) => {
  const api = useStorybookApi();
  const state = useStorybookState();
  const [checklist, setChecklist] = useState<ChecklistFile | null>(null);
  const [isOutdated, setIsOutdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [componentPath, setComponentPath] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    level: ["all"],
    status: ["all"],
  });
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  const currentStoryId = state.storyId;
  const guidelines = useMemo(
    () => getGuidelinesByVersion(DEFAULT_CONFIG.wcagVersion),
    [],
  );
  const clientManager = useMemo(() => new ChecklistClientManager(), []);

  // Load checklist when story changes
  useEffect(() => {
    if (!active || !currentStoryId || !componentPath) return;

    loadChecklist();
  }, [active, currentStoryId, componentPath]);

  const loadChecklist = useCallback(async () => {
    if (!currentStoryId || !componentPath) return;

    setLoading(true);
    setError(null);

    try {
      const data = await clientManager.loadChecklist(
        currentStoryId,
        componentPath,
        DEFAULT_CONFIG.wcagVersion,
      );

      // Check if we're in read-only mode
      setIsReadOnlyMode(clientManager.isReadOnlyMode());

      // If no checklist exists, create a default one
      if (!data.checklist) {
        const defaultChecklist = clientManager.createDefaultChecklist(
          currentStoryId,
          componentPath,
          undefined, // component name - could be derived from story
          DEFAULT_CONFIG.wcagVersion,
        );
        setChecklist(defaultChecklist);
        setIsOutdated(false);
      } else {
        setChecklist(data.checklist);
        setIsOutdated(data.isOutdated);
      }

      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load checklist");
    } finally {
      setLoading(false);
    }
  }, [currentStoryId, componentPath, clientManager]);

  const saveChecklist = useCallback(async () => {
    if (!checklist || !currentStoryId) return;

    setSaving(true);
    setError(null);

    try {
      const data = await clientManager.saveChecklist(currentStoryId, checklist);

      setHasUnsavedChanges(false);
      setIsOutdated(false);

      // Update the hash
      if (data.hash && checklist) {
        setChecklist({
          ...checklist,
          componentHash: data.hash,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save checklist");
    } finally {
      setSaving(false);
    }
  }, [checklist, currentStoryId, clientManager]);

  const updateChecklistItem = useCallback(
    (guidelineId: string, updates: Partial<ChecklistItem>) => {
      if (!checklist) return;

      const updatedResults = checklist.results.map((item) =>
        item.guidelineId === guidelineId ? { ...item, ...updates } : item,
      );

      setChecklist({
        ...checklist,
        results: updatedResults,
      });
      setHasUnsavedChanges(true);
    },
    [checklist],
  );

  // Filter guidelines based on current filters
  const filteredGuidelines = useMemo(() => {
    return guidelines.filter((guideline) => {
      const matchesSearch =
        filters.search === "" ||
        guideline.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        guideline.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        guideline.id.includes(filters.search);

      const matchesLevel =
        filters.level.includes("all") || filters.level.includes(guideline.level);

      const currentItem = checklist?.results.find(
        (r) => r.guidelineId === guideline.id,
      );
      const matchesStatus =
        filters.status.includes("all") || 
        (currentItem && filters.status.includes(currentItem.status));

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [guidelines, filters, checklist]);

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!checklist) return { pass: 0, fail: 0, not_applicable: 0, unknown: 0, total: 0 };

    const stats = checklist.results.reduce(
      (acc, item) => {
        acc[item.status]++;
        acc.total++;
        return acc;
      },
      { pass: 0, fail: 0, not_applicable: 0, unknown: 0, total: 0 },
    );

    return stats;
  }, [checklist]);

  if (!active) {
    return null;
  }

  return (
    <TabWrapper>
      <div style={{ marginBottom: "24px" }}>
        <Header>
          <Title>A11Y Checklist</Title>
          <ButtonGroup>
            {isOutdated && <Badge variant="warning">Outdated</Badge>}
            {isReadOnlyMode && <Badge variant="secondary">Read-Only</Badge>}
            <Button
              variant="primary"
              onClick={saveChecklist}
              disabled={!hasUnsavedChanges || saving || isReadOnlyMode}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </ButtonGroup>
        </Header>

        {/* Component Path Input */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Component Path:
          </label>
          <Input
            type="text"
            value={componentPath}
            onChange={(e) => setComponentPath(e.target.value)}
            placeholder="e.g., src/components/Button.tsx"
            disabled={isReadOnlyMode}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            {isReadOnlyMode 
              ? "Read-only mode: API server unavailable. Showing saved checklist data."
              : "Enter the path to your component file."
            }
          </div>
        </div>

        {/* Summary */}
        {checklist && (
          <SummaryContainer>
            <SummaryBlock 
              color="#495057" 
              backgroundColor="#f8f9fa"
            >
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{summary.total}</SummaryValue>
            </SummaryBlock>
            <SummaryBlock 
              color={STATUS_COLORS.pass} 
              backgroundColor={`${STATUS_COLORS.pass}15`}
            >
              <SummaryLabel>Pass</SummaryLabel>
              <SummaryValue>{summary.pass}</SummaryValue>
            </SummaryBlock>
            <SummaryBlock 
              color={STATUS_COLORS.fail} 
              backgroundColor={`${STATUS_COLORS.fail}15`}
            >
              <SummaryLabel>Fail</SummaryLabel>
              <SummaryValue>{summary.fail}</SummaryValue>
            </SummaryBlock>
            <SummaryBlock 
              color={STATUS_COLORS.not_applicable} 
              backgroundColor={`${STATUS_COLORS.not_applicable}15`}
            >
              <SummaryLabel>N/A</SummaryLabel>
              <SummaryValue>{summary.not_applicable}</SummaryValue>
            </SummaryBlock>
            <SummaryBlock 
              color={STATUS_COLORS.unknown} 
              backgroundColor={`${STATUS_COLORS.unknown}15`}
            >
              <SummaryLabel>Unknown</SummaryLabel>
              <SummaryValue>{summary.unknown}</SummaryValue>
            </SummaryBlock>
          </SummaryContainer>
        )}

        {/* Last Update Info */}
        {checklist && (checklist.lastUpdated || checklist.updatedBy) && (
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "16px",
              padding: "8px",
              background: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            {checklist.lastUpdated && (
              <div>
                Last updated: {new Date(checklist.lastUpdated).toLocaleString()}
              </div>
            )}
            {checklist.updatedBy && (
              <div>Auditor: {checklist.updatedBy}</div>
            )}
          </div>
        )}

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <Input
            type="text"
            placeholder="Search guidelines..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ flex: 1, minWidth: "200px" }}
          />
          <MultiSelect
            options={[
              { value: "all" as const, label: "All Levels" },
              { value: "A" as const, label: "Level A" },
              { value: "AA" as const, label: "Level AA" },
              { value: "AAA" as const, label: "Level AAA" },
            ]}
            value={filters.level}
            onChange={(level) =>
              setFilters((prev) => ({ ...prev, level }))
            }
            placeholder="Select Levels"
          />
          <MultiSelect
            options={[
              { value: "all" as const, label: "All Status" },
              { value: "pass" as const, label: "Pass" },
              { value: "fail" as const, label: "Fail" },
              { value: "not_applicable" as const, label: "N/A" },
              { value: "unknown" as const, label: "Unknown" },
            ]}
            value={filters.status}
            onChange={(status) =>
              setFilters((prev) => ({ ...prev, status }))
            }
            placeholder="Select Status"
          />
        </div>

        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading checklist...
        </div>
      ) : (
        <div>
          {filteredGuidelines.map((guideline) => {
            const currentItem = checklist?.results.find(
              (r) => r.guidelineId === guideline.id,
            );
            const status = currentItem?.status || "unknown";
            const reason = currentItem?.reason || "";

            return (
              <GuidelineCard key={guideline.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <h3
                        style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}
                      >
                        {guideline.id}
                      </h3>
                      <Badge level={guideline.level}>
                        {guideline.level}
                      </Badge>
                      <Badge
                        variant={
                          status === "pass"
                            ? "success"
                            : status === "fail"
                              ? "danger"
                              : status === "unknown"
                                ? "warning"
                                : "secondary"
                        }
                      >
                        {STATUS_LABELS[status]}
                      </Badge>
                    </div>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {guideline.title}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {guideline.description}
                    </p>
                    <a
                      href={guideline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "#007bff" }}
                    >
                      View WCAG Specification →
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "4px",
                      }}
                    >
                      Status:
                    </label>
                    <Select
                      value={status}
                      onChange={(e) =>
                        updateChecklistItem(guideline.id, {
                          status: e.target.value as ChecklistStatus,
                          reason:
                            e.target.value === "fail" ? reason : undefined,
                        })
                      }
                      disabled={isReadOnlyMode}
                    >
                      <option value="unknown">Unknown</option>
                      <option value="not_applicable">Not Applicable</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </Select>
                  </div>

                  {status === "fail" && (
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: 500,
                          marginBottom: "4px",
                        }}
                      >
                        Reason for failure:
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) =>
                          updateChecklistItem(guideline.id, {
                            reason: e.target.value,
                          })
                        }
                        placeholder="Explain why this guideline fails..."
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "14px",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  )}
                </div>
              </GuidelineCard>
            );
          })}

          {filteredGuidelines.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              No guidelines match the current filters.
            </div>
          )}
        </div>
      )}
    </TabWrapper>
  );
};
