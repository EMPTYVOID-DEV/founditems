import type { SubmitFunction } from '@sveltejs/kit';

export type SubmitFunctionBefore = (params: Parameters<SubmitFunction>[0]) => void;

export type SubmitFunctionAfter = Extract<ReturnType<SubmitFunction>, Function>;
