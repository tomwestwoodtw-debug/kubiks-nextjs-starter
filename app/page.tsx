"use client";

import { useEffect, useMemo, useState } from "react";

type View = "checkin" | "plan" | "sands" | "resources";

const steps = [
	{
		title: "Notice",
		discreetTitle: "Weather",
		body: "Name what is happening without arguing with it.",
		discreetBody: "Name the current conditions without making them bigger.",
		prompt: "The main warning sign I notice is",
		discreetPrompt: "The first weather change I notice is",
	},
	{
		title: "Reduce access",
		discreetTitle: "Clear the table",
		body: "Put distance between yourself and anything that could make a bad moment worse.",
		discreetBody: "Move sharp, heavy, or high-risk items out of easy reach for now.",
		prompt: "One thing I can move away from me is",
		discreetPrompt: "One thing I can put away is",
	},
	{
		title: "Contact",
		discreetTitle: "Signal",
		body: "Tell one person you do not need to be alone with this.",
		discreetBody: "Send a small signal to one person who can stay nearby.",
		prompt: "The person I can contact is",
		discreetPrompt: "The person I can signal is",
	},
	{
		title: "Professional help",
		discreetTitle: "Backup",
		body: "Use urgent support if you may act on thoughts of suicide or cannot stay safe.",
		discreetBody: "Use backup if the situation feels too close or too fast.",
		prompt: "The service I can use is",
		discreetPrompt: "The backup I can use is",
	},
];

const resources = [
	{
		name: "Emergency services",
		detail: "Call your local emergency number if there is immediate danger.",
		action: "Use now",
	},
	{
		name: "988 Lifeline",
		detail: "US and Canada crisis support by call or text.",
		action: "Call or text 988",
	},
	{
		name: "Samaritans",
		detail: "UK and ROI listening support, day or night.",
		action: "Call 116 123",
	},
	{
		name: "Trusted contact",
		detail: "Open a message to someone who can stay with you or check in.",
		action: "Draft message",
	},
];

const checkInCopy = {
	plain: {
		title: "Safety check",
		body: "A quiet place to make the next few minutes less dangerous.",
		intensity: "How strong are the suicide-related thoughts right now?",
		action: "Open safety plan",
	},
	discreet: {
		title: "Weather check",
		body: "A quiet place to make the next few minutes more manageable.",
		intensity: "How strong is the weather right now?",
		action: "Open plan",
	},
};

function Icon({ name }: { name: View | "moon" | "eye" | "text" }) {
	const paths = {
		checkin: "M4 12h4l2-6 4 12 2-6h4",
		plan: "M7 4h10v16H7z M10 8h4 M10 12h4 M10 16h2",
		sands: "M5 7c4-3 10 3 14 0 M5 12c4-3 10 3 14 0 M5 17c4-3 10 3 14 0",
		resources: "M12 5v14 M5 12h14",
		moon: "M18 15.5A7 7 0 0 1 8.5 6 8 8 0 1 0 18 15.5z",
		eye: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
		text: "M4 7h16 M8 7v10 M16 7v10 M7 17h4 M13 17h4",
	};

	return (
		<svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
			<path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default function Home() {
	const [view, setView] = useState<View>("checkin");
	const [night, setNight] = useState(false);
	const [discreet, setDiscreet] = useState(false);
	const [softLanguage, setSoftLanguage] = useState(true);
	const [intensity, setIntensity] = useState(4);
	const [notes, setNotes] = useState<Record<string, string>>({});
	const [sandPattern, setSandPattern] = useState(0);

	useEffect(() => {
		const saved = window.localStorage.getItem("sands-preferences");
		if (!saved) return;
		const parsed = JSON.parse(saved);
		setNight(Boolean(parsed.night));
		setDiscreet(Boolean(parsed.discreet));
		setSoftLanguage(parsed.softLanguage !== false);
	}, []);

	useEffect(() => {
		window.localStorage.setItem(
			"sands-preferences",
			JSON.stringify({ night, discreet, softLanguage }),
		);
	}, [night, discreet, softLanguage]);

	const copy = discreet && softLanguage ? checkInCopy.discreet : checkInCopy.plain;
	const planSteps = useMemo(
		() =>
			steps.map((step) =>
				discreet && softLanguage
					? {
							title: step.discreetTitle,
							body: step.discreetBody,
							prompt: step.discreetPrompt,
						}
					: step,
			),
		[discreet, softLanguage],
	);

	return (
		<main className={`app-shell ${night ? "night" : ""} ${view === "plan" ? "safety-active" : ""}`}>
			<section className="topbar" aria-label="Mode controls">
				<div>
					<p className="eyebrow">Sands</p>
					<h1>{copy.title}</h1>
				</div>
				<div className="mode-controls">
					<button className={night ? "active" : ""} onClick={() => setNight((value) => !value)} title="Night mode">
						<Icon name="moon" />
					</button>
					<button className={discreet ? "active" : ""} onClick={() => setDiscreet((value) => !value)} title="Discreet mode">
						<Icon name="eye" />
					</button>
					<button
						className={softLanguage ? "active" : ""}
						onClick={() => setSoftLanguage((value) => !value)}
						disabled={!discreet}
						title="Discreet language"
					>
						<Icon name="text" />
					</button>
				</div>
			</section>

			<nav className="nav-rail" aria-label="Sections">
				{(["checkin", "plan", "sands", "resources"] as View[]).map((item) => (
					<button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)} title={item}>
						<Icon name={item} />
						<span>{item === "checkin" ? "Check" : item === "plan" ? "Plan" : item === "sands" ? "Sands" : "Help"}</span>
					</button>
				))}
			</nav>

			<section className="workspace">
				{view === "checkin" && (
					<div className="panel hero-panel">
						<p>{copy.body}</p>
						<label className="slider-row">
							<span>{copy.intensity}</span>
							<strong>{intensity}</strong>
							<input
								type="range"
								min="0"
								max="10"
								value={intensity}
								onChange={(event) => setIntensity(Number(event.target.value))}
							/>
						</label>
						<div className="quick-actions">
							<button onClick={() => setView("plan")}>{copy.action}</button>
							<button className="secondary" onClick={() => setView("sands")}>Use Sands</button>
						</div>
					</div>
				)}

				{view === "plan" && (
					<div className="plan-grid">
						{planSteps.map((step, index) => (
							<label className="plan-card" key={step.title}>
								<span className="count">{index + 1}</span>
								<h2>{step.title}</h2>
								<p>{step.body}</p>
								<span className="field-label">{step.prompt}</span>
								<textarea
									value={notes[step.title] ?? ""}
									onChange={(event) => setNotes((current) => ({ ...current, [step.title]: event.target.value }))}
									rows={3}
								/>
							</label>
						))}
					</div>
				)}

				{view === "sands" && (
					<div className="panel sands-panel">
						<div className={`sand-field pattern-${sandPattern}`} onClick={() => setSandPattern((value) => (value + 1) % 4)}>
							{Array.from({ length: 9 }).map((_, index) => (
								<span key={index} style={{ "--i": index } as React.CSSProperties} />
							))}
						</div>
						<div>
							<h2>Sands</h2>
							<p>Tap the sand to change the pattern. Use it as a low-word, interactive pause when the screen needs to stay quiet.</p>
							<div className="quick-actions">
								<button onClick={() => setSandPattern((value) => (value + 1) % 4)}>Shift pattern</button>
								<button className="secondary" onClick={() => setView("plan")}>Back to plan</button>
							</div>
						</div>
					</div>
				)}

				{view === "resources" && (
					<div className="resource-list">
						{resources.map((resource) => (
							<article className="resource-card" key={resource.name}>
								<h2>{resource.name}</h2>
								<p>{resource.detail}</p>
								<span>{resource.action}</span>
							</article>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
