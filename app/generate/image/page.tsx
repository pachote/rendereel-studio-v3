"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Job = {
	id: string;
	status: string;
	createdAt: number;
	output?: string[] | null;
	error?: string | null;
};

const aspectOptions = ["1:1", "3:2", "16:9", "4:5"] as const;

export default function GenerateImage() {
	const [prompt, setPrompt] = useState("");
	const [steps, setSteps] = useState(28);
	const [guidance, setGuidance] = useState(4);
	const [aspectRatio, setAspectRatio] = useState<(typeof aspectOptions)[number]>("1:1");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [activeJobId, setActiveJobId] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const remainingChars = useMemo(() => 500 - prompt.length, [prompt.length]);

	const pollJob = useCallback(async (id: string) => {
		try {
			const res = await fetch(`/api/flux?id=${id}`);
			const data = await res.json();
			setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: data.status, output: data.output, error: data.error } : j)));
			if (data.status === "succeeded" || data.status === "failed" || data.status === "canceled") {
				setActiveJobId(null);
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			}
		} catch (e) {
			setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "failed", error: "Polling error" } : j)));
			setActiveJobId(null);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	}, []);

	useEffect(() => {
		if (activeJobId && !intervalRef.current) {
			intervalRef.current = setInterval(() => {
				pollJob(activeJobId);
			}, 2000);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [activeJobId, pollJob]);

	const handleGenerate = async () => {
		if (!prompt.trim()) return;
		setIsSubmitting(true);
		try {
			const res = await fetch('/api/flux', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt, steps, guidance, aspectRatio }),
			});
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			const job: Job = { id: data.id, status: data.status, createdAt: Date.now() };
			setJobs((prev) => [job, ...prev].slice(0, 10));
			setActiveJobId(job.id);
		} catch (e) {
			// Error banner could be shown
		} finally {
			setIsSubmitting(false);
		}
	};

	const latestOutput = jobs.find((j) => j.output && j.status === 'succeeded')?.output;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-white">FLUX Image Generation</h1>
				<p className="text-[rgba(255,255,255,0.6)] mt-1">Powered by Replicate • ~$0.011 per image</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] p-5">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-white">Prompt</h3>
							<span className={`text-xs ${remainingChars < 0 ? 'text-red-400' : 'text-[rgba(255,255,255,0.6)]'}`}>{remainingChars} chars</span>
						</div>
						<textarea
							value={prompt}
							onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
							placeholder="Ultra-detailed cinematic portrait, dramatic lighting, shallow depth of field..."
							className="w-full h-36 resize-none rounded-xl bg-black/40 border border-[rgba(255,255,255,0.08)] p-3 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#0066ff]/40"
						/>
					</div>

					<div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] p-5">
						<h3 className="text-sm font-medium text-white mb-4">Parameters</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<label className="block text-xs text-[rgba(255,255,255,0.6)] mb-2">Aspect Ratio</label>
								<select
									value={aspectRatio}
									onChange={(e) => setAspectRatio(e.target.value as any)}
									className="w-full rounded-lg bg-black/40 border border-[rgba(255,255,255,0.08)] p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0066ff]/40"
								>
									{aspectOptions.map((opt) => (
										<option key={opt} value={opt}>{opt}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-xs text-[rgba(255,255,255,0.6)] mb-2">Steps: {steps}</label>
								<input
									type="range"
									min={1}
									max={50}
									value={steps}
									onChange={(e) => setSteps(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-xs text-[rgba(255,255,255,0.6)] mb-2">Guidance: {guidance}</label>
								<input
									type="range"
									min={1}
									max={10}
									value={guidance}
									onChange={(e) => setGuidance(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
						</div>
					</div>

					<button
						onClick={handleGenerate}
						disabled={isSubmitting || prompt.trim().length === 0}
						className="w-full bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors"
					>
						{isSubmitting ? 'Queuing...' : 'Generate Image'}
					</button>
				</div>

				<div className="space-y-6">
					<div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] p-5">
						<h3 className="text-sm font-medium text-white mb-3">Generation Queue</h3>
						<div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
							{jobs.length === 0 && (
								<p className="text-[rgba(255,255,255,0.6)] text-sm">No jobs yet.</p>
							)}
							{jobs.map((job) => (
								<div key={job.id} className="flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.08)] bg-black/40 p-2">
									<div className="text-xs text-[rgba(255,255,255,0.7)] truncate mr-2">{job.id}</div>
									<span className={`text-[10px] px-2 py-0.5 rounded-full ${
										job.status === 'succeeded' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
										job.status === 'failed' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
										'bg-[#0066ff]/20 text-[#9dc6ff] border border-[#0066ff]/40'
									}`}>{job.status}</span>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] p-5">
						<h3 className="text-sm font-medium text-white mb-3">Result</h3>
						{latestOutput ? (
							<div className="space-y-3">
								<img src={latestOutput[0]} alt="Result" className="w-full rounded-xl border border-[rgba(255,255,255,0.08)]" />
								<a
									href={latestOutput[0]}
									download
									className="inline-flex items-center justify-center w-full bg-black/40 hover:bg-black/60 text-white border border-[rgba(255,255,255,0.1)] rounded-xl py-2 text-sm transition-colors"
								>
									Download
								</a>
							</div>
						) : (
							<p className="text-[rgba(255,255,255,0.6)] text-sm">Your image will appear here.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
