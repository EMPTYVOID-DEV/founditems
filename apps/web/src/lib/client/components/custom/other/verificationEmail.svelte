<script lang="ts">
	let { code, expiryMinutes }: { code: string; expiryMinutes?: number } = $props();
</script>

<div
	style="
	font-family: Arial, sans-serif;
	max-width: 600px;
	margin: 0 auto;
	border: 1px solid #333c48; /* border (charcoal gray) */
	border-radius: 8px;
	padding: 24px;  
	background-color: #f4f6f9; /* background/card/popover (light gray) */
	color: #2a2f3a; /* foreground/card-foreground/popover-foreground (charcoal gray) */
"
>
	<div style="text-align: center; margin-bottom: 24px;">
		<h1 style="color: #2a2f3a; font-size: 28px; margin: 0 0 8px;">Code de Vérification</h1>
		<p style="color: #59606d; font-size: 16px; margin: 0;">
			Veuillez utiliser le code ci-dessous pour finaliser votre vérification
		</p>
	</div>

	<div
		style="
		background-color: #e3e7f0; /* muted */
		border: 1px solid #5a6270; /* muted-foreground (darker for contrast) */
		border-radius: 6px;
		padding: 16px;
		text-align: center;
		margin: 24px 0;
	"
	>
		<p style="color: #444b57; font-size: 16px; margin: 0 0 8px;">
			Votre code de vérification est :
		</p>
		<div
			style="
			color: #2463eb; /* primary (bright blue) */
			font-size: 32px;
			font-weight: bold;
			letter-spacing: 4px;
			margin: 8px 0;
		"
		>
			{code}
		</div>
		<p style="color: #5a6270; font-size: 14px; margin: 8px 0 0;">
			Ce code expirera dans {expiryMinutes} minutes
		</p>
	</div>

	<p style="color: #444b57; font-size: 14px; margin: 0 0 16px;">
		Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail ou contacter l'assistance si
		vous avez des inquiétudes.
	</p>
</div>
