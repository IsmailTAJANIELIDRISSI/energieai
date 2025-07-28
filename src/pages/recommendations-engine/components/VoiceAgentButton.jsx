import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Anthropic from "@anthropic-ai/sdk";

import Icon from "../../../components/AppIcon";

const VoiceAgentButton = ({ energyData, machines, onNewRecommendations }) => {
  const [isListening, setIsListening] = useState(false);

  const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });

  const handleVoiceCommand = async () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.onstart = () => {
      setIsListening(true);
      toast("Écoute en cours...", { icon: "🎙️" });
    };
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setIsListening(false);

      const prompt = `
    Vous êtes un agent vocal dans une usine intelligente. Répondez à : "${transcript}"
    Données :
    - Énergie : ${JSON.stringify(energyData.slice(-5), null, 2)}
    - Machines : ${JSON.stringify(machines, null, 2)}
    Générez une recommandation pour optimiser l'énergie ou la maintenance :
    - title (titre court)
    - description (2-3 phrases)
    - machine_id (e.g., COMP-001)
    - priority (Critique, Élevée, Moyenne, Faible)
    - potential_savings (MAD/mois, estimé)
    - payback_period (mois)
    - difficulty (Facile, Modérée, Difficile)
    - implementation_steps (liste de 2-3 étapes)
    - energy_reduction (%)
    - implementation_cost (MAD)
    - environmental_impact (objet avec les champs suivants)
      - co2_reduction (tonnes/an, estimé, basé sur des métriques industrielles au Maroc)
      - energy_saved (kWh/an, estimé)
    - business_impact (objet avec les champs suivants)
      - efficiency_improvement (%, estimé)
      - risk_reduction (description courte, e.g., "Diminution des pannes et maintenance préventive")
      - regulatory_compliance (description courte, e.g., "Respect des normes environnementales marocaines")
    - resources_required (objet avec les champs suivants)
      - personnel (description, e.g., "2 techniciens, 4 heures")
      - tools (description, e.g., "Outils standard de maintenance")
      - duration (description, e.g., "1-2 jours ouvrables")
      - cost (MAD, doit correspondre à implementation_cost)
    Formattez en JSON uniquement, sans texte supplémentaire.
  `;

      try {
        const claudeResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const newRec = JSON.parse(
          claudeResponse.content[0].text.replace(/```json|```/g, "")
        );

        const recommendation = {
          ...newRec,
          id: `REC-AI-${Date.now()}`,
          icon: "Lightbulb",
          generated_at: new Date().toISOString(),
          generated_by: "Claude AI",
        };

        await axios.post(
          `${import.meta.env.VITE_JSON_SERVER_URL}/recommendations`,
          recommendation
        );

        onNewRecommendations(recommendation);
        toast.success(`Nouvelle recommandation pour ${newRec.machine_id}`);
      } catch (error) {
        console.error("Claude API error:", error);
        toast.error("Erreur lors de la commande vocale.");
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleVoiceCommand}
      className={isListening ? "bg-red-600" : "bg-primary"}
    >
      <Icon name={isListening ? "MicOff" : "Mic"} size={20} />
    </Button>
  );
};

export default VoiceAgentButton;
