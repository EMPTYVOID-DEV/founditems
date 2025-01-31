import type { BaseTranslation } from '../i18n-types';

const ar: BaseTranslation = {
	general: {
		confirm: 'تأكيد',
		cancel: 'إلغاء',
		success: 'نجاح',
		error: 'خطأ',
		info: 'معلومات'
	},
	errors: {
		forbidden: 'غير مسموح',
		notFound: 'غير موجود',
		internalServerError: 'خطأ في الخادم',
		badRequest: 'طلب خاطئ',
		serviceUnavailable: 'الخدمة غير متوفرة'
	},
	validation: {
		fullname: 'الاسم الكامل يجب أن يكون على الأقل 6 أحرف',
		email: 'عنوان البريد الإلكتروني غير صالح',
		passwordLength: 'يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل',
		passwordSpecialChar: 'يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل',
		passwordNumber: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل',
		passwordUppercase: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل',
		passwordLowercase: 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل'
	},
	auth: {
		login: 'تسجيل الدخول',
		signup: 'إنشاء حساب',
		fullname: 'الاسم الكامل',
		email: 'البريد الالكتروني',
		password: 'كلمة المرور',
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
		expiredCode: 'الرمز منتهي الصلاحية، حاول إعادة الإرسال'
	},
	navbar: {
		selectLanguage: 'اختر اللغة',
		claims: 'المطالبات',
		posts: 'المشاركات',
		search: 'بحث'
	},
	home: {
		title: 'اجد اشيائك المفقودة بدون عناء',
		description: 'منصة مبتكرة لتوصيل المفقودات بأصحابها مع نظام آمن لإدارة المطالبات ومنع الاحتيال',
		findYourThings: 'ابحث عن أشيائك'
	}
};

export default ar;
