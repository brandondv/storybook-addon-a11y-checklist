import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useStorybookApi, useStorybookState } from "@storybook/manager-api";
import { ChecklistClientManager } from "../utils/client-manager";
import { getGuidelinesByVersion } from "../data/wcag-guidelines";
import { DEFAULT_CONFIG } from "../constants";
import type { ChecklistFile, ChecklistItem, ChecklistStatus } from "../types";
import {
  PanelWrapper,
  Header,
  Title,
  ButtonGroup,
  Badge,
  Button,
} from "./ui/StyledComponents";
import { SummaryBlocks } from "./ui/SummaryBlocks";
import { ChecklistFilters } from "./ui/ChecklistFilters";
import { GuidelineCard } from "./ui/GuidelineCard";

interface PanelProps {
  active: boolean;
}

interface FilterState {
  level: string[];
  search: string;
  status: string[];
}

export const Panel: React.FC<PanelProps> = ({ active }) => {
  if (!active) return null;

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
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  const currentStoryId = state.storyId;
  const currentStory =
    state.storiesHash?.[currentStoryId || ""] ||
    state.index?.[currentStoryId || ""] ||
    null;
  const componentPath = `${((currentStory as any)?.componentPath as string).replace("../", "") || ""}`;
  const componentId = (currentStory as any)?.parent || "";

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

      if (data.checklist) {
        setChecklist(data.checklist);
        setIsOutdated(data.isOutdated);
      }

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error loading checklist:", err);
      setError(err instanceof Error ? err.message : "Failed to load checklist");
    } finally {
      setLoading(false);
    }
  }, [componentId, componentPath, clientManager]);

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
      return { passed: 0, failed: 0, unknown: 0, not_applicable: 0, total: 0 };

    const stats = checklist.results.reduce(
      (acc, item) => {
        // Map internal status to display format
        if (item.status === "pass") acc.passed++;
        else if (item.status === "fail") acc.failed++;
        else if (item.status === "not_applicable") acc.not_applicable++;
        else if (item.status === "unknown") acc.unknown++;

        acc.total++;
        return acc;
      },
      { passed: 0, failed: 0, unknown: 0, not_applicable: 0, total: 0 },
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
          <Title>A11Y Checklist for {componentId}</Title>
          <ButtonGroup>
            {isOutdated && <Badge variant="danger">Outdated</Badge>}
            {isReadOnlyMode ? (
              <Badge variant="secondary">Read-Only</Badge>
            ) : (
              <Button
                variant="primary"
                onClick={saveChecklist}
                disabled={!hasUnsavedChanges || saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </ButtonGroup>
        </Header>

        {/* Last Updated Info */}
        {checklist && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Last updated:{" "}
              {new Date(checklist.lastUpdated).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {checklist && <SummaryBlocks summary={summary} />}

        {/* Filters */}
        <ChecklistFilters
          searchTerm={filters.search}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          selectedLevels={filters.level}
          onLevelsChange={(levels) =>
            setFilters((prev) => ({ ...prev, level: levels }))
          }
          selectedStatuses={filters.status}
          onStatusesChange={(statuses) =>
            setFilters((prev) => ({ ...prev, status: statuses }))
          }
        />

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
              <GuidelineCard
                key={guideline.id}
                guideline={{
                  ...guideline,
                  status,
                  failureReason: reason,
                }}
                isReadOnly={isReadOnlyMode}
                onStatusChange={(id, newStatus) => {
                  updateChecklistItem(id, {
                    status: newStatus,
                    reason: newStatus === "failed" ? reason : undefined,
                  });
                }}
                onFailureReasonChange={(id, newReason) => {
                  updateChecklistItem(id, { reason: newReason });
                }}
              />
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
