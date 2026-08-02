import React, { useMemo, useCallback } from "react";
import { Bot, Check } from "lucide-react";
import { EModelEndpoint } from "librechat-data-provider";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@librechat/client";
import {
	useAgentsMapContext,
	useChatContext,
	useAssistantsMapContext,
} from "~/Providers";
import { useGetEndpointsQuery, useGetStartupConfig } from "~/data-provider";
import useSelectMention from "~/hooks/Input/useSelectMention";

export function AgentSelect() {
	const { conversation, newConversation, getConversation } = useChatContext();
	const agentsMap = useAgentsMapContext();

	const assistantsMap = useAssistantsMapContext();
	const { data: endpointsConfig } = useGetEndpointsQuery();
	const { data: startupConfig } = useGetStartupConfig();

	const { onSelectEndpoint } = useSelectMention({
		getConversation,
		newConversation,
		endpointsConfig,
		modelSpecs: startupConfig?.modelSpecs?.list ?? [],
		assistantsMap,
		returnHandlers: true,
	});

	const agents = useMemo(() => Object.values(agentsMap ?? {}), [agentsMap]);
	const currentAgentId = conversation?.agent_id;

	const selectedAgent = useMemo(() => {
		if (!currentAgentId || !agentsMap) return null;
		return agentsMap[currentAgentId] ?? null;
	}, [agentsMap, currentAgentId]);

	const handleSelectAgent = useCallback(
		(agentId: string) => {
			const agent = agentsMap?.[agentId];
			onSelectEndpoint?.(EModelEndpoint.agents, {
				agent_id: agentId,
				model: agent?.model ?? "",
			});
		},
		[agentsMap, onSelectEndpoint],
	);

	if (!agents || agents.length === 0) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Select Agent"
					className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
						selectedAgent
							? "border-primary/50 bg-primary/10 text-primary font-semibold"
							: "border-border-light bg-transparent text-text-primary hover:bg-surface-hover font-medium"
					}`}
				>
					{selectedAgent ? (
						<>
							{selectedAgent.avatar?.filepath ? (
								<img
									src={selectedAgent.avatar.filepath}
									alt={selectedAgent.name}
									className="h-3.5 w-3.5 rounded-full object-cover"
								/>
							) : (
								<Bot className="h-3.5 w-3.5 text-primary" />
							)}
							<span className="max-w-[110px] truncate">{selectedAgent.name}</span>
						</>
					) : (
						<>
							<Bot className="h-3.5 w-3.5 text-text-secondary" />
							<span>Agents</span>
						</>
					)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="w-56 rounded-xl border border-border-light bg-surface-chat-alt p-1.5 shadow-lg text-text-primary z-50"
			>
				{agents.map((agent) => {
					const isSelected = agent.id === currentAgentId;
					return (
						<DropdownMenuItem
							key={agent.id}
							onSelect={() => handleSelectAgent(agent.id)}
							className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover cursor-pointer transition-colors"
						>
							<div className="flex items-center gap-2 truncate">
								{agent.avatar?.filepath ? (
									<img
										src={agent.avatar.filepath}
										alt={agent.name}
										className="h-3.5 w-3.5 rounded-full object-cover"
									/>
								) : (
									<Bot className="h-3.5 w-3.5 text-text-tertiary" />
								)}
								<span className="truncate">{agent.name || "Unnamed Agent"}</span>
							</div>
							{isSelected && (
								<Check className="h-3.5 w-3.5 text-primary ml-2 flex-shrink-0" />
							)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
