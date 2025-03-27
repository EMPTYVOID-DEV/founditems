import { TextSimilarity } from '../services/textSimilarity.js';
import { zodEnv } from '../shared/env.js';

async function runTests() {
	const a = new TextSimilarity();
	await a.initialize();

	const testCases = [
		// Cross-language (Expected: true)
		{ text1: 'keskas aimen', text2: 'كسكاس ايمن', expected: true },
		{
			text1: 'Modèle iPhone 13 Pro avec écran Super Retina XDR avancé',
			text2: 'آيفون ١٣ برو مع شاشة سوبر ريتينا إكس دي آر متطورة',
			expected: true
		},
		{
			text1: 'Papier peint minimaliste blanc avec des motifs géométriques subtils',
			text2: 'خلفية بيضاء بسيطة مع نقوش هندسية دقيقة',
			expected: true
		},
		{
			text1: 'Smartphone Samsung Galaxy S22 Ultra avec caméra professionnelle',
			text2: 'سامسونج جالاكسي إس٢٢ الترا مع كاميرا احترافية',
			expected: true
		},
		{
			text1: 'Téléphone Google Pixel 6 avec intelligence artificielle avancée',
			text2: 'جوجل بيكسل ٦ مع ذكاء اصطناعي متقدم',
			expected: true
		},
		{
			text1: 'Entrepreneur technologique Elon Musk et ses innovations révolutionnaires',
			text2: 'إيلون ماسك رجل الأعمال التكنولوجي وابتكاراته الثورية',
			expected: true
		},

		// Same-language comparisons (Expected: true)
		{
			text1: 'الهاتف الذكي سامسونج جالاكسي اس ٢٢ الترا مع كاميرا متطورة',
			text2: 'سامسونج جالاكسي إس٢٢ الترا مع كاميرا احترافية',
			expected: true
		},
		{
			text1: 'Exploration spatiale et missions vers Mars et au-delà',
			text2: 'Les voyages interstellaires et les missions vers Mars',
			expected: true
		},

		// Slightly modified (Expected: true, tests nuance handling)
		{
			text1: 'Photographie de paysage naturel capturant la beauté des montagnes',
			text2: 'Image d’un paysage naturel mettant en valeur les montagnes',
			expected: true
		},
		{
			text1: 'Design steampunk mélangeant esthétique victorienne et technologie',
			text2: 'Esthétique steampunk combinant technologie et influence victorienne',
			expected: true
		},

		// Unrelated texts (Expected: false)
		{
			text1: 'Le café noir est une boisson populaire dans le monde entier',
			text2: 'Les galaxies spirales sont fascinantes par leur structure',
			expected: false
		},
		{
			text1: 'Un peintre célèbre du XIXe siècle',
			text2: 'Un ingénieur en intelligence artificielle moderne',
			expected: false
		},
		{
			text1: 'محمد علي، بطل عالمي في الملاكمة',
			text2: 'الذكاء الاصطناعي هو مستقبل التكنولوجيا',
			expected: false
		},
		{
			text1: 'Un train à grande vitesse traverse la campagne',
			text2: 'Les océans abritent une diversité biologique incroyable',
			expected: false
		},
		{
			text1: 'الهندسة المعمارية الإسلامية تمتاز بالقباب المزخرفة',
			text2: 'الأجهزة الإلكترونية الحديثة تعتمد على الذكاء الاصطناعي',
			expected: false
		}
	];

	for (const { text1, text2, expected } of testCases) {
		const similarity = await a.getSimilarity(text1, text2);
		console.log(`Text 1: ${text1}`);
		console.log(`Text 2: ${text2}`);
		console.log(`Similarity: ${similarity}`);
		console.log(`Expected Match: ${expected}`);
		console.log(`Actual Match: ${similarity > zodEnv.TEXT_SIMILARITY_THRESHOLD}`);
	}
}

runTests();
