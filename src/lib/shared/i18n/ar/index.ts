import type { BaseTranslation } from '../i18n-types';

const ar: BaseTranslation = {
	general: {
		confirm: 'تأكيد',
		cancel: 'إلغاء',
		success: 'نجاح',
		error: 'خطأ',
		info: 'معلومات',
		select: 'اختيار',
		language: 'اللغة',
		upload: 'اسحب الملفات وأفلِتها هنا، أو انقر لتحديد الملفات'
	},
	errors: {
		forbidden: 'غير مسموح',
		notFound: 'غير موجود',
		internalServerError: 'خطأ في الخادم',
		badRequest: 'طلب خاطئ',
		serviceUnavailable: 'الخدمة غير متوفرة'
	},
	schema: {
		fullname: 'الاسم الكامل',
		email: 'البريد الالكتروني',
		password: 'كلمة المرور',
		address: 'العنوان الفعلي',
		avatar: 'الصورة الرمزية',
		phoneNumber: 'رقم هاتف'
	},
	validation: {
		fullname: 'الاسم الكامل يجب أن يكون على الأقل {0} أحرف',
		email: 'عنوان البريد الإلكتروني غير صالح',
		address: 'يجب أن يكون عنوانك {0} حرفًا على الأقل',
		phoneNumber: 'يجب أن يكون رقم الهاتف مكونًا من 10 أرقام',
		imageSize: 'حجم الصورة لا يمكن أن يتجاوز {0} ميجا بايت',
		invalidImageUpload: 'يجب عليك تحميل ملف الصورة',
		maxFilesNumber: 'يمكنك تحميل ما يصل إلى {0} ملف',
		passwordLength: 'يجب أن تكون كلمة المرور مكونة من {0} أحرف على الأقل',
		passwordSpecialChar: 'يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل',
		passwordNumber: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل',
		passwordUppercase: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل',
		passwordLowercase: 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل'
	},
	auth: {
		login: 'تسجيل الدخول',
		signup: 'إنشاء حساب',
		alreadyHaveAccount: 'لديك حساب بالفعل؟',
		dontHaveAccount: 'ليس لديك حساب؟',
		forgetPassword: 'نسيت كلمة المرور؟',
		sendTheCode: 'إرسال الرمز',
		resendEmail: 'إعادة إرسال البريد الإلكتروني',
		resendSuccess: 'تم إعادة إرسال البريد الإلكتروني بنجاح',
		sendSuccess: 'تم إرسال الرمز بنجاح',
		resetPasswordSuccess: 'تم إعادة تعيين كلمة المرور بنجاح',
		verifyCode: 'تحقق من الرمز',
		lostPasswordEmail: 'اكتب البريد الإلكتروني الذي نسيت كلمة المرور الخاصة به',
		resetPassword:
			'لقد أرسلنا لك كلمة مرور لمرة واحدة؛ تحقق من صندوق الوارد في بريدك الإلكتروني. ثم اكتب كلمة المرور الجديدة.',
		confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
		verificationEmail:
			'لقد أرسلنا لك كلمة مرور للتحقق من بريدك الإلكتروني. تحقق من صندوق الوارد الخاص بك؛ إذا لم يكن موجودًا، تحقق من مجلد البريد العشوائي',
		acounntAlreadyExist: 'يبدو أن هذا الحساب موجود بالفعل',
		accountDoesNotExist: 'يبدو أن هذا الحساب غير موجود',
		passwordIncorrect: 'كلمة المرور غير صحيحة',
		incorrectCode: 'الرمز غير صحيح',
		expiredCode: 'الرمز منتهي الصلاحية، حاول إعادة الإرسال',
		logout: 'تسجيل الخروج'
	},
	navbar: {
		selectLanguage: 'اختر اللغة',
		claims: 'المطالبات',
		posts: 'المنشورات',
		search: 'بحث'
	},
	home: {
		title: 'اجد اشيائك المفقودة بدون عناء',
		description: 'منصة مبتكرة لتوصيل المفقودات بأصحابها مع نظام آمن لإدارة المطالبات ومنع الاحتيال',
		findYourThings: 'ابحث عن أشيائك'
	},
	profile: {
		fullnameChange: 'يمكنك تغيير اسمك الكامل',
		fullnameChangeSuccess: 'تم تغيير الاسم بنجاح',
		addressChange:
			'يجب عليك تحديد عنوانك قبل إنشاء منشور. تأكد من تحديد العنوان الكامل مع الرمز البريدي',
		addressChangeSuccess: 'تم تغيير العنوان بنجاح',
		avatarChange: 'يمكنك تغيير الصورة الرمزية الخاصة بك',
		avatarChangeSuccess: 'تم تغيير الصورة الرمزية بنجاح',
		logout: 'يمكنك تسجيل الخروج. سيؤدي هذا إلى إنهاء جلسة التصفح الخاصة بك',
		phoneNumberChange: 'يجب عليك تحديد رقم هاتفك قبل إنشاء المنشور',
		phoneNumberChangeSuccess: 'تم تغيير رقم الهاتف بنجاح'
	}
};

export default ar;
