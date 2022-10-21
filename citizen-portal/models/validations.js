export default {
  required: {
    required: true,
  },
  text_required: {
    required: true,
    min: 3,
    max: 2500,
  },
  text: {
    min: 3,
    max: 2500,
  },
  excel_file_required: {
    required: true,
    mimes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  pdf_file_required: {
    required: true,
    mimes: ['application/pdf'],
  },
  any_doc_files_required: {
    required: true,
    mimes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
    ],
  },
  input_text_required: {
    required: true,
    min: 3,
    max: 191,
  },
  input_password_required: {
    required: true,
    min: 8,
    max: 12,
  },
  input_alpha_dash_required: {
    required: true,
    alpha_dash: true,
    min: 3,
    max: 30,
  },
  input_alpha_dash_required_perms: {
    required: true,
    alpha_dash: true,
    min: 3,
    max: 191,
  },
  input_alpha_dots_required: {
    required: true,
    alpha_dots: true,
    min: 3,
    max: 30,
  },
  input_alpha_dash: {
    alpha_dash: true,
    min: 3,
    max: 30,
  },
  input_alpha_spaces_required: {
    required: true,
    alpha_spaces: true,
    min: 3,
    max: 45,
  },
  input_alpha_spaces: {
    alpha_spaces: true,
    min: 3,
    max: 45,
  },
  input_text: {
    min: 3,
    max: 80,
  },
  input_email_required: {
    required: true,
    email: true,
    min: 3,
    max: 125,
  },
  input_email_confirmation: (input) => ({
    required: true,
    email: true,
    min: 3,
    max: 125,
    confirmed: input,
  }),
  input_email: {
    email: true,
    min: 3,
    max: 125,
  },
  input_number_required: {
    required: true,
    numeric: true,
  },
  input_number: {
    numeric: true,
  },
  input_phone_required: {
    required: true,
    numeric: true,
    digits: 7,
  },
  input_phone: {
    numeric: true,
    digits: 7,
  },
  input_mobile_required: {
    required: true,
    numeric: true,
    digits: 10,
  },
  input_mobile: {
    numeric: true,
    digits: 10,
  },
  input_document_required: {
    required: true,
    numeric: true,
    min: 3,
    max: 12,
  },
  input_document: {
    numeric: true,
    min: 3,
    max: 12,
  },
  input_date_required: {
    required: true,
    date_format: 'YYYY-MM-DD',
  },
  input_date: {
    date_format: 'YYYY-MM-DD',
  },
  input_date_after: (target) => ({
    date_format: 'YYYY-MM-DD',
    greater_than_or_equal_to: target,
  }),
  input_date_after_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD',
    greater_than_or_equal_to: target,
  }),
  input_date_before: (target) => ({
    date_format: 'YYYY-MM-DD',
    less_than_or_equal_to: target,
  }),
  input_date_before_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD',
    less_than_or_equal_to: target,
  }),
  input_date_equal: (target) => ({
    date_format: 'YYYY-MM-DD',
    date_equal_to: target,
  }),
  input_date_equal_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD',
    date_equal_to: target,
  }),
  input_date_is_between_required: (min, max) => ({
    required: true,
    date_format: 'YYYY-MM-DD',
    date_is_between: [min, max],
  }),
  input_date_is_between: (min, max) => ({
    date_format: 'YYYY-MM-DD',
    date_is_between: [min, max],
  }),
  input_time_required: {
    required: true,
    date_format: 'HH:mm',
  },
  input_time: {
    date_format: 'HH:mm',
  },
  input_datetime_required: {
    required: true,
    date_format: 'YYYY-MM-DD HH:mm:ss',
  },
  input_datetime: {
    date_format: 'YYYY-MM-DD HH:mm:ss',
  },
  input_datetime_after_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD HH:mm:ss',
    greater_than_or_equal_to: target,
  }),
  input_datetime_before_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD HH:mm:ss',
    less_than_or_equal_to: target,
  }),
  input_datetime_is_between_required: (min, max) => ({
    required: true,
    date_format: 'YYYY-MM-DD',
    date_is_between: [min, max],
  }),
  input_datetime_after: (target) => ({
    date_format: 'YYYY-MM-DD HH:mm:ss',
    greater_than_or_equal_to: target,
  }),
  input_datetime_before: (target) => ({
    date_format: 'YYYY-MM-DD HH:mm:ss',
    less_than_or_equal_to: target,
  }),
  input_datetime_is_between: (min, max) => ({
    date_format: 'YYYY-MM-DD',
    date_is_between: [min, max],
  }),
  input_datetime_equal_required: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD HH:mm:ss',
    date_equal_to: target,
  }),
  input_datetime_equal: (target) => ({
    required: true,
    date_format: 'YYYY-MM-DD HH:mm:ss',
    date_equal_to: target,
  }),
  input_number_required_between: (min, max) => ({
    required: true,
    numeric: true,
    between: [min, max],
  }),
  input_number_between: (min, max) => ({
    numeric: true,
    between: [min, max],
  }),
  input_text_required_unique: (id) => ({
    required: true,
    min: 3,
    max: 80,
    unique: id,
  }),
  input_text_unique: (id) => ({
    min: 3,
    max: 80,
    unique: id,
  }),
  input_image_required: {
    required: true,
    image: true,
  },
  input_image: {
    image: true,
  },
}
