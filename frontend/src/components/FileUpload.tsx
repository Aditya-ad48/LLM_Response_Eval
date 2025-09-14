import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputData, EvaluationData } from "@/types/evaluation";
import axios from "axios";

interface FileUploadProps {
  onDataUpload: (data: EvaluationData[]) => void;
  isLoading: boolean;
}

export function FileUpload({ onDataUpload, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const inputData = JSON.parse(text) as InputData[];

      // Validate the input data structure
      if (!Array.isArray(inputData) || inputData.length === 0) {
        throw new Error("Invalid file format: Expected an array of input data");
      }

      const requiredInputFields = [
        "prompt_id",
        "prompt",
        "response",
        "agent_id",
      ];
      const isValidInput = inputData.every((item) =>
        requiredInputFields.every((field) => field in item)
      );

      if (!isValidInput) {
        throw new Error(
          "Invalid input format: Missing required fields (prompt_id, prompt, response, agent_id)"
        );
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/evaluate/`, // Add trailing slash
        inputData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const evaluationData = response.data as EvaluationData[];

      // Validate that backend returned complete evaluation data
      const requiredOutputFields = [
        "prompt_id",
        "prompt",
        "response",
        "agent_id",
        "instruction_score",
        "is_hallucination",
        "nli_prediction",
        "coherence_score",
      ];
      const isValidOutput = evaluationData.every((item) =>
        requiredOutputFields.every((field) => field in item)
      );

      if (!isValidOutput) {
        throw new Error("Backend returned incomplete evaluation data");
      }

      onDataUpload(evaluationData);

      toast({
        title: "File processed successfully",
        description: `Evaluated ${inputData.length} prompts and received complete results`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(
      (file) => file.type === "application/json" || file.name.endsWith(".json")
    );

    if (jsonFile) {
      handleFileUpload(jsonFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center ${
            dragActive ? "bg-primary/5" : ""
          }`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Evaluation Data</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your JSON file here, or click to browse
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>JSON files only</span>
          </div>

          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {isLoading ? "Processing..." : "Choose File"}
          </Button>

          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Expected Input JSON format:</p>
                <pre className="mt-1 text-[10px] opacity-75">
                  {`[{
  "prompt_id": "string",
  "prompt": "string",
  "response": "string", 
  "agent_id": "string"
}]`}
                </pre>
                <p className="mt-2 text-[10px] opacity-60">
                  Backend will add: instruction_score, is_hallucination,
                  nli_prediction, coherence_score
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
