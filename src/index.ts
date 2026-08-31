/**
 * GitHub Action for deploying Docker images to Coolify.
 *
 * This action builds and pushes a Docker image using buildx, then triggers
 * a deployment on a Coolify instance and monitors the deployment status.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as core from "@actions/core";
import { deployApplication } from "./lib/deploy.js";

/**
 * Main action entry point.
 */
try {
  const coolifyURL = core.getInput("coolify-url", { required: true });
  const appName = core.getInput("app-name", { required: true });
  const image = core.getInput("image", { required: true });
  const token = core.getInput("coolify-token", { required: true });
  let envVars = core.getInput("env-vars", { required: false });
  const envFile = core.getInput("env-file", { required: false });

  core.info(`Starting deployment... ${envFile}`); // debuf
  if (envFile) {
    const envFilePath = resolve(process.env.GITHUB_WORKSPACE || ".", envFile);
    if (!existsSync(envFilePath))
      throw new Error(`Env file not found: ${envFilePath}`);
    const fileContent = readFileSync(envFilePath, "utf-8");
    envVars = envVars ? `${fileContent}\n${envVars}` : fileContent;
  }
  const healthcheckPath =
    core.getInput("healthcheck-path", { required: false }) || "/";
  const healthcheckTimeout = parseInt(
    core.getInput("healthcheck-timeout", { required: false }) || "60",
    10,
  );
  const context = core.getInput("context", { required: false }) || ".";

  const { deploymentUUID, healthcheckUrl } = await deployApplication({
    coolifyURL,
    appName,
    image,
    coolifyToken: token,
    envVars,
    healthcheckPath,
    healthcheckTimeout,
    context,
    logger: {
      info: (message: string) => core.info(message),
      error: (message: string) => core.error(message),
      debug: (message: string) => core.debug(message),
    },
  });

  core.setOutput("deployment-uuid", deploymentUUID);
  core.setOutput("healthcheck-url", healthcheckUrl);
} catch (error) {
  if (error instanceof Error) core.setFailed(error.message);
  else core.setFailed("An unknown error occurred");
}
