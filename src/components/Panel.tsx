import React, { useState, useEffect, useMemo, useCallback } from "react";
import { styled } from "storybook/theming";
import { useStorybookApi, useStorybookState } from "storybook/manager-api";
import { ChecklistClientManager } from "../utils/client-manager";
import {
  WCAG_2_2_GUIDELINES,
  getGuidelinesByVersion,
} from "../data/wcag-guidelines";
import { DEFAULT_CONFIG } from "../constants";
import type {
  ChecklistFile,
  ChecklistItem,
  WCAGGuideline,
  ChecklistStatus,
} from "../types";

interface PanelProps {
  active: boolean;
}

interface FilterState {
  level: string[];
  search: string;
  status: string[];
}

const STATUS_COLORS = {
  pass: "#28a745",
  fail: "#dc3545",
  not_applicable: "#6c757d",
  unknown: "#ffc107",
} as const;

const STATUS_LABELS = {
  pass: "Pass",
  fail: "Fail",
  not_applicable: "N/A",
  unknown: "Unknown",
} as const;

const LEVEL_COLORS = {
  A: "#4ade80",     // Light green
  AA: "#22c55e",    // Medium green  
  AAA: "#16a34a",   // Dark green
} as const;

const PanelWrapper = styled.div(({ theme }) => ({
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
  fontSize: "18px",
  fontWeight: 600,
});

const ButtonGroup = styled.div({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

const Badge = styled.span<{
  variant?: "warning" | "success" | "danger" | "secondary";
  customColor?: string;
}>(({ variant, customColor, theme }) => {
  if (customColor) {
    return {
      background: customColor,
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
    };
  }

  const colors = {
    warning: { bg: "#ffc107", color: "#212529" },
    success: { bg: "#28a745", color: "white" },
    danger: { bg: "#dc3545", color: "white" },
    secondary: { bg: "#6c757d", color: "white" },
  };

  const colorScheme = variant ? colors[variant] : colors.secondary;

  return {
    background: colorScheme.bg,
    color: colorScheme.color,
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

const MultiSelectContainer = styled.div({
  position: "relative",
  display: "inline-block",
});

const MultiSelectButton = styled.button({
  padding: "8px 24px 8px 8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  background: "white",
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

const MultiSelectCheckbox = styled.input({
  marginRight: "8px",
});

const GuidelineCard = styled.div(({ theme }) => ({
  border: `1px solid ${theme.color.border}`,
  borderRadius: "8px",
  marginBottom: "12px",
  padding: "16px",
  background: theme.background.content,
}));

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return options.find(opt => opt.value === selected[0])?.label || "";
    return `${selected.length} selected`;
  };

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
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
        {options.map(option => (
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

export const Panel: React.FC<PanelProps> = ({ active }) => {
  if (!active) return null;

  const api = useStorybookApi();
  const state = useStorybookState();
  const [checklist, setChecklist] = useState<ChecklistFile | null>(null);
  const [isOutdated, setIsOutdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    level: [],
    status: [],
  });
  const [customComponentPath, setCustomComponentPath] = useState("");
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  const currentStoryId = state.storyId;
  const currentStory = state.storiesHash?.[currentStoryId || ""] || null;

  // Auto-detect component path from story, but allow user override
  const componentPath = useMemo(() => {
    // Use custom path if provided
    if (customComponentPath.trim()) {
      return customComponentPath.trim();
    }

    if (!currentStory || !currentStory.title) {
      return "src/components/Component.tsx";
    }

    // Try to extract from story parameters or title
    const storyTitle = currentStory.title || "";
    const componentName = storyTitle.split("/").pop() || "Component";

    // Generate a reasonable component path
    return `src/components/${componentName}.tsx`;
  }, [currentStory, customComponentPath]);

  // Generate component ID from path for checklist identification
  const componentId = useMemo(() => {
    if (!componentPath) return "component";

    // Extract component name from path and normalize it
    // e.g., "src/components/Button.tsx" -> "button"
    // e.g., "components/MyButton/MyButton.jsx" -> "mybutton"
    const fileName = componentPath.split("/").pop() || "component";
    const nameWithoutExt = fileName.replace(/\.(tsx?|jsx?)$/, "");
    return nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/gi, "");
  }, [componentPath]);

  const guidelines = useMemo(
    () => getGuidelinesByVersion(DEFAULT_CONFIG.wcagVersion),
    [],
  );
  const clientManager = useMemo(() => new ChecklistClientManager(), []);

  const loadChecklist = useCallback(async () => {
    if (!componentId || !componentPath) return;

    setLoading(true);
    setError(null);

    try {
      const data = await clientManager.loadChecklist(
        componentId,
        componentPath,
        DEFAULT_CONFIG.wcagVersion,
      );

      // Check if we're in read-only mode
      setIsReadOnlyMode(clientManager.isReadOnlyMode());

      // If no checklist exists, create a default one
      if (!data.checklist) {
        const componentName =
          componentPath
            .split("/")
            .pop()
            ?.replace(/\.(tsx?|jsx?)$/, "") || "Component";
        const defaultChecklist = clientManager.createDefaultChecklist(
          componentId,
          componentPath,
          componentName,
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
      console.error("Error loading checklist:", err);
      setError(err instanceof Error ? err.message : "Failed to load checklist");
      setChecklist(null); // Don't auto-create, let user decide
    } finally {
      setLoading(false);
    }
  }, [componentId, componentPath, clientManager]);

  const createDefaultChecklist = useCallback(() => {
    try {
      const componentName =
        componentPath
          .split("/")
          .pop()
          ?.replace(/\.(tsx?|jsx?)$/, "") || "Component";
      const defaultChecklist: ChecklistFile = {
        version: DEFAULT_CONFIG.wcagVersion,
        componentId: componentId,
        componentName: componentName,
        componentPath: componentPath,
        componentHash: "",
        lastUpdated: new Date().toISOString(),
        results: guidelines.map((guideline) => ({
          guidelineId: guideline.id,
          level: guideline.level,
          status: "unknown" as ChecklistStatus,
          reason: undefined,
        })),
        meta: {
          notes: "",
          generatedBy: "storybook-addon-a11y-checklist@1.0.0",
        },
      };

      setChecklist(defaultChecklist);
    } catch (err) {
      console.error("Error creating default checklist:", err);
      setError("Failed to create checklist");
    }
  }, [componentId, componentPath, guidelines]);

  const saveChecklist = useCallback(async () => {
    if (!checklist || !componentId) return;

    setSaving(true);
    setError(null);

    try {
      const data = await clientManager.saveChecklist(componentId, checklist);

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
      console.error("Error saving checklist:", err);
      setError(err instanceof Error ? err.message : "Failed to save checklist");
    } finally {
      setSaving(false);
    }
  }, [checklist, componentId, clientManager]);

  // Load checklist when component changes
  useEffect(() => {
    if (!active || !componentId || !componentPath) return;

    loadChecklist();
  }, [active, componentId, componentPath, loadChecklist]);

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
        filters.level.length === 0 || filters.level.includes(guideline.level);

      const currentItem = checklist?.results.find(
        (r) => r.guidelineId === guideline.id,
      );
      const matchesStatus =
        filters.status.length === 0 ||
        (currentItem?.status && filters.status.includes(currentItem.status));

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [guidelines, filters, checklist]);

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!checklist)
      return { pass: 0, fail: 0, not_applicable: 0, unknown: 0, total: 0 };

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
    <PanelWrapper>
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
            value={customComponentPath || componentPath}
            onChange={(e) => {
              setCustomComponentPath(e.target.value);
            }}
            placeholder="e.g., src/components/Button.tsx"
            disabled={isReadOnlyMode}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            {isReadOnlyMode
              ? "Read-only mode: API server unavailable. Showing saved checklist data."
              : "Auto-detected from story. Edit if needed."}
          </div>
        </div>

        {/* Last Updated Info */}
        {checklist && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Last updated: {new Date(checklist.lastUpdated).toLocaleString()}
              {checklist.updatedBy && <span> by {checklist.updatedBy}</span>}
            </div>
          </div>
        )}

        {/* Summary */}
        {checklist && (
          <SummaryContainer>
            <SummaryBlock color="#495057" backgroundColor="#f8f9fa">
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

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
            alignItems: "center",
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
              { value: "A", label: "Level A" },
              { value: "AA", label: "Level AA" },
              { value: "AAA", label: "Level AAA" },
            ]}
            selected={filters.level}
            onChange={(selected) =>
              setFilters((prev) => ({ ...prev, level: selected }))
            }
            placeholder="All Levels"
          />
          <MultiSelect
            options={[
              { value: "pass", label: "Pass" },
              { value: "fail", label: "Fail" },
              { value: "not_applicable", label: "N/A" },
              { value: "unknown", label: "Unknown" },
            ]}
            selected={filters.status}
            onChange={(selected) =>
              setFilters((prev) => ({ ...prev, status: selected }))
            }
            placeholder="All Status"
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

        {/* Create Checklist Button - shown when no checklist exists */}
        {!loading && !checklist && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#f8f9fa",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#495057" }}>
              No A11Y Checklist Found
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#6c757d" }}>
              Create a new accessibility checklist for this story to start
              tracking WCAG compliance.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                createDefaultChecklist();
                setHasUnsavedChanges(true);
              }}
            >
              Create A11Y Checklist
            </Button>
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
                        style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}
                      >
                        {guideline.id}
                      </h3>
                      <Badge
                        customColor={
                          LEVEL_COLORS[
                            guideline.level as keyof typeof LEVEL_COLORS
                          ]
                        }
                      >
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
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      {guideline.title}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {guideline.description}
                    </p>
                    <a
                      href={guideline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "11px", color: "#007bff" }}
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
                        fontSize: "12px",
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
                      style={{ fontSize: "12px" }}
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
                          fontSize: "12px",
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
                          padding: "6px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "12px",
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
    </PanelWrapper>
  );
};
