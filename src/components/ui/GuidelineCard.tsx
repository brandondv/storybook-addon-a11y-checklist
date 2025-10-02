import React from "react";
import { styled } from "@storybook/theming";
import { Badge, Button, Link, Select } from "./StyledComponents";
import { STATUS_COLORS, STATUS_LABELS, LEVEL_COLORS } from "./constants";

const GuidelineItemCard = styled.div({
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
});

const GuidelineHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
});

const GuidelineInfo = styled.div({
  flex: 1,
});

const GuidelineTitle = styled.h3({
  margin: "0",
  fontSize: "16px",
  fontWeight: "600",
});

const GuidelineDetails = styled.div({
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginBottom: "8px",
});

const GuidelineDescription = styled.p({
  margin: "0",
  fontSize: "14px",
  color: "#a6a6a6ff",
  lineHeight: "1.4",
});

const StatusControls = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "12px",
});

const FailureReasonTextarea = styled.textarea({
  width: "100%",
  minHeight: "80px",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "inherit",
  resize: "vertical",
  marginTop: "8px",
  color: "#333",
});

interface GuidelineItem {
  id: string;
  title: string;
  description: string;
  level: string;
  status: "passed" | "failed" | "not_applicable" | "unknown";
  failureReason?: string;
  url: string;
}

interface GuidelineCardProps {
  guideline: GuidelineItem;
  isReadOnly: boolean;
  onStatusChange: (
    id: string,
    status: "passed" | "failed" | "not_applicable" | "unknown",
  ) => void;
  onFailureReasonChange: (id: string, reason: string) => void;
}

// Helper function to map status values to constant keys
const mapStatusToKey = (status: string) => {
  switch (status) {
    case "passed":
      return "pass";
    case "failed":
      return "fail";
    case "not_applicable":
      return "not_applicable";
    case "unknown":
      return "unknown";
    default:
      return "unknown";
  }
};

export const GuidelineCard: React.FC<GuidelineCardProps> = ({
  guideline,
  isReadOnly,
  onStatusChange,
  onFailureReasonChange,
}) => {
  return (
    <GuidelineItemCard>
      <GuidelineHeader>
        <GuidelineInfo>
          <GuidelineDetails>
            <Badge
              customColor={STATUS_COLORS[mapStatusToKey(guideline.status)]}
            >
              {STATUS_LABELS[mapStatusToKey(guideline.status)]}
            </Badge>

            <Badge
              customColor={
                LEVEL_COLORS[guideline.level as keyof typeof LEVEL_COLORS]
              }
            >
              {guideline.level}
            </Badge>

            <GuidelineTitle>
              {guideline.id} {guideline.title}
            </GuidelineTitle>

          </GuidelineDetails>

          <GuidelineDescription>{guideline.description}</GuidelineDescription>

          <Link href={guideline.url} target="_blank" rel="noopener noreferrer">
            Read more
          </Link>
        </GuidelineInfo>
      </GuidelineHeader>

      {!isReadOnly && (
        <StatusControls>
          <>
            <Button
              variant={guideline.status === "passed" ? "primary" : "secondary"}
              onClick={() => onStatusChange(guideline.id, "passed")}
              style={{
                backgroundColor:
                  guideline.status === "passed" ? "#28a745" : "#f8f9fa",
                color: guideline.status === "passed" ? "white" : "#333",
                border: `1px solid ${guideline.status === "passed" ? "#28a745" : "#dee2e6"}`,
              }}
            >
              ✓ Pass
            </Button>

            <Button
              variant={guideline.status === "failed" ? "primary" : "secondary"}
              onClick={() => onStatusChange(guideline.id, "failed")}
              style={{
                backgroundColor:
                  guideline.status === "failed" ? "#dc3545" : "#f8f9fa",
                color: guideline.status === "failed" ? "white" : "#333",
                border: `1px solid ${guideline.status === "failed" ? "#dc3545" : "#dee2e6"}`,
              }}
            >
              ✗ Fail
            </Button>

            <Button
              variant={
                guideline.status === "not_applicable" ? "primary" : "secondary"
              }
              onClick={() => onStatusChange(guideline.id, "not_applicable")}
              style={{
                backgroundColor:
                  guideline.status === "not_applicable" ? "#6c757d" : "#f8f9fa",
                color: guideline.status === "not_applicable" ? "white" : "#333",
                border: `1px solid ${guideline.status === "not_applicable" ? "#6c757d" : "#dee2e6"}`,
              }}
            >
              Not Applicable
            </Button>
          </>
        </StatusControls>
      )}

      {(guideline.status === "failed" || guideline.failureReason) && (
        <FailureReasonTextarea
          placeholder={
            isReadOnly
              ? "No failure reason provided"
              : "Describe why this guideline failed ..."
          }
          value={guideline.failureReason || ""}
          onChange={(e) => onFailureReasonChange(guideline.id, e.target.value)}
          readOnly={isReadOnly}
          style={{
            backgroundColor: isReadOnly ? "#f8f9fa" : "white",
            cursor: isReadOnly ? "not-allowed" : "text",
          }}
        />
      )}
    </GuidelineItemCard>
  );
};
