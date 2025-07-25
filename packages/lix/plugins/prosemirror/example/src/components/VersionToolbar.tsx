import React, { useRef } from "react";
import {
	selectActiveVersion,
	selectMainVersion,
	selectVersions,
	selectActiveAccount,
} from "../queries";
import { useQuery } from "../hooks/useQuery";
import { lix } from "../state";
import { createVersion, switchVersion } from "@lix-js/sdk";

const VersionToolbar: React.FC = () => {
	const [currentVersion] = useQuery(selectActiveVersion);
	const [mainVersion] = useQuery(selectMainVersion);
	const [activeAccount] = useQuery(selectActiveAccount);
	const [versions] = useQuery(selectVersions);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Determine if current version is the main version
	const isMainVersion = mainVersion?.id === currentVersion?.id;

	// Handle version change
	const handleVersionChange = async (versionId: string) => {
		try {
			await switchVersion({ lix, to: { id: versionId } });
		} catch (error) {
			console.error("Error switching version:", error);
		}
	};

	const handleNewVersion = async () => {
		try {
			// Extract the first name from the account name
			const firstName = activeAccount?.name
				? activeAccount.name.split(" ")[0]
				: "User";

			const newVersion = await createVersion({
				lix,
				name: `${firstName}'s Version`,
				changeSet: { id: currentVersion!.change_set_id },
			});
			await switchVersion({ lix, to: newVersion });
			// Scroll to the end of the scrollbar after a short delay to ensure DOM update
			setTimeout(() => {
				scrollToEnd();
			}, 100);
		} catch (error) {
			console.error("Error creating new version:", error);
		}
	};

	const handleProposeChanges = async () => {
		try {
			// Extract the first name from the account name
			const firstName = activeAccount?.name
				? activeAccount.name.split(" ")[0]
				: "User";

			const existingVersion = versions?.find(
				(version) => version.name === `${firstName}'s Version`,
			);
			if (existingVersion) {
				await switchVersion({ lix, to: { id: existingVersion.id } });
			} else {
				const newVersion = await createVersion({
					lix,
					name: `${firstName}'s Version`,
					changeSet: { id: currentVersion!.change_set_id },
				});
				await switchVersion({ lix, to: { id: newVersion.id } });
			}
			// Scroll to the end of the scrollbar after a short delay to ensure DOM update
			setTimeout(() => {
				scrollToEnd();
			}, 100);
		} catch (error) {
			console.error("Error creating version:", error);
		}
	};

	// Scroll to the end of the scrollbar
	const scrollToEnd = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollLeft =
				scrollContainerRef.current.scrollWidth;
		}
	};

	return (
		<div
			className="mode-tabs"
			style={{ boxSizing: "border-box", height: "40px", borderRadius: "0" }}
		>
			<div className="mode-tabs-scroll-container" ref={scrollContainerRef}>
				{versions?.map((version) => (
					<button
						key={version.id}
						className={`mode-tab ${version.id === currentVersion?.id ? "active" : ""}`}
						onClick={() => handleVersionChange(version.id)}
						style={{
							height: "40px",
							boxSizing: "border-box",
							borderRadius: "0",
						}}
					>
						{version.name}
					</button>
				))}
			</div>

			<div className="mode-tab-fixed">
				{isMainVersion ? (
					<button
						className="mode-tab"
						onClick={handleNewVersion}
						style={{
							height: "40px",
							boxSizing: "border-box",
							borderRadius: "0",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							paddingRight: "12px",
						}}
					>
						<span>+ new version</span>
					</button>
				) : (
					<button
						className="mode-tab"
						onClick={handleProposeChanges}
						style={{
							height: "40px",
							boxSizing: "border-box",
							borderRadius: "0",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							paddingRight: "12px",
						}}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
							fill="#000000"
							style={{ marginRight: "6px", flexShrink: 0 }}
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M5.616 4.928a2.487 2.487 0 0 1-1.119.922c-.148.06-.458.138-.458.138v5.008a2.51 2.51 0 0 1 1.579 1.062c.273.412.419.895.419 1.388.008.343-.057.684-.19 1A2.485 2.485 0 0 1 3.5 15.984a2.482 2.482 0 0 1-1.388-.419A2.487 2.487 0 0 1 1.05 13c.095-.486.331-.932.68-1.283.349-.343.79-.579 1.269-.68V5.949a2.6 2.6 0 0 1-1.269-.68 2.503 2.503 0 0 1-.68-1.283 2.487 2.487 0 0 1 1.06-2.565A2.49 2.49 0 0 1 3.5 1a2.504 2.504 0 0 1 1.807.729 2.493 2.493 0 0 1 .729 1.81c.002.494-.144.978-.42 1.389zm-.756 7.861a1.5 1.5 0 0 0-.552-.579 1.45 1.45 0 0 0-.77-.21 1.495 1.495 0 0 0-1.47 1.79 1.493 1.493 0 0 0 1.18 1.179c.288.058.586.03.86-.08.276-.117.512-.312.68-.56.15-.226.235-.49.249-.76a1.51 1.51 0 0 0-.177-.78zM2.708 4.741c.247.161.536.25.83.25.271 0 .538-.075.77-.211a1.514 1.514 0 0 0 .729-1.359 1.513 1.513 0 0 0-.25-.76 1.551 1.551 0 0 0-.68-.56 1.49 1.49 0 0 0-.86-.08 1.494 1.494 0 0 0-1.179 1.18c-.058.288-.03.586.08.86.117.276.312.512.56.68zm10.329 6.296c.48.097.922.335 1.269.68.466.47.729 1.107.725 1.766.002.493-.144.977-.42 1.388a2.499 2.499 0 0 1-4.532-.899 2.5 2.5 0 0 1 1.067-2.565c.267-.183.571-.308.889-.37V5.489a1.5 1.5 0 0 0-1.5-1.499H8.687l1.269 1.27-.71.709L7.117 3.84v-.7l2.13-2.13.71.711-1.269 1.27h1.85a2.484 2.484 0 0 1 2.312 1.541c.125.302.189.628.187.957v5.548zm.557 3.509a1.493 1.493 0 0 0 .191-1.89 1.552 1.552 0 0 0-.68-.559 1.49 1.49 0 0 0-.86-.08 1.493 1.493 0 0 0-1.179 1.18 1.49 1.49 0 0 0 .08.86 1.496 1.496 0 0 0 2.448.49z"
							/>
						</svg>
						<span>Propose changes</span>
					</button>
				)}
			</div>
		</div>
	);
};

export default VersionToolbar;
