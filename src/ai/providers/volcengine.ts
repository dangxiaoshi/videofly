import type {
  AIVideoProvider,
  VideoGenerationParams,
  VideoTaskResponse,
} from "../types";

import Signer from "@volcengine/openapi/lib/base/sign";

const REGION = "cn-north-1";
const SERVICE = "cv";
const HOST = "visual.volcengineapi.com";
const SUBMIT_ACTION = "CVSync2AsyncSubmitTask";
const QUERY_ACTION = "CVSync2AsyncGetResult";
const API_VERSION = "2022-08-31";

async function volcengineRequest(
  accessKey: string,
  secretKey: string,
  action: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const bodyStr = JSON.stringify(body);

  const signerRequest = {
    method: "POST",
    pathname: "/",
    params: { Action: action, Version: API_VERSION },
    headers: { Host: HOST },
    body: bodyStr,
    region: REGION,
  };

  const signer = new Signer(signerRequest, SERVICE);
  signer.addAuthorization({ accessKeyId: accessKey, secretKey });

  const headers: Record<string, string> = {
    ...signerRequest.headers,
    "Content-Type": "application/json",
  };

  const url = `https://${HOST}/?Action=${action}&Version=${API_VERSION}`;
  const response = await fetch(url, { method: "POST", headers, body: bodyStr });

  const data = await response.json() as Record<string, unknown>;
  const meta = data.ResponseMetadata as Record<string, unknown> | undefined;
  const code = (meta?.Error as Record<string, unknown> | undefined)?.Code;

  if (code) {
    const msg = (meta?.Error as Record<string, unknown>)?.Message as string;
    throw new Error(msg || `Volcengine error: ${code}`);
  }

  return data;
}

function mapStatus(status: number | string): VideoTaskResponse["status"] {
  // String statuses from CVSync2AsyncGetResult
  if (status === "done") return "completed";
  if (status === "failed" || status === "error") return "failed";
  if (status === "submitted" || status === "queue") return "pending";
  if (status === "running" || status === "processing") return "processing";
  // Numeric statuses (legacy)
  if (status === 50) return "completed";
  if (typeof status === "number" && status < 0) return "failed";
  if (status === 10) return "pending";
  return "processing";
}

function getReqKey(params: VideoGenerationParams): string {
  const hasImage =
    (Array.isArray(params.imageUrls) && params.imageUrls.length > 0) ||
    !!params.imageUrl;
  if (hasImage) return "jimeng_i2v_v30";
  return "jimeng_t2v_v30";
}

export class VolcengineProvider implements AIVideoProvider {
  name = "volcengine";
  supportImageToVideo = true;
  private accessKey: string;
  private secretKey: string;

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  async createTask(params: VideoGenerationParams): Promise<VideoTaskResponse> {
    const reqKey = getReqKey(params);

    const duration = params.duration || 5;
    const frames = Math.round(duration * 24) + 1; // 5s=121, 8s=193

    const body: Record<string, unknown> = {
      req_key: reqKey,
      prompt: params.prompt,
      aspect_ratio: params.aspectRatio || "16:9",
      frames,
    };

    if (params.imageUrl) body.first_frame_image = params.imageUrl;
    if (params.callbackUrl) body.callback_url = params.callbackUrl;

    const data = await volcengineRequest(
      this.accessKey,
      this.secretKey,
      SUBMIT_ACTION,
      body
    ) as { data: { task_id: string } };

    return {
      taskId: data.data.task_id,
      provider: "volcengine",
      status: "pending",
      raw: data,
    };
  }

  async getTaskStatus(taskId: string): Promise<VideoTaskResponse> {
    const body = { req_key: "jimeng_t2v_v30", task_id: taskId };

    const data = await volcengineRequest(
      this.accessKey,
      this.secretKey,
      QUERY_ACTION,
      body
    ) as { data: { task_id: string; status: number | string; video_url?: string; error_msg?: string } };

    const task = data.data;

    return {
      taskId: task.task_id,
      provider: "volcengine",
      status: mapStatus(task.status),
      videoUrl: task.video_url,
      error: task.error_msg
        ? { code: "TASK_FAILED", message: task.error_msg }
        : undefined,
      raw: data,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseCallback(payload: any): VideoTaskResponse {
    return {
      taskId: payload.task_id,
      provider: "volcengine",
      status: mapStatus(payload.status),
      videoUrl: payload.video_url,
      error: payload.error_msg
        ? { code: "TASK_FAILED", message: payload.error_msg }
        : undefined,
      raw: payload,
    };
  }
}
