import { configure, defineRule } from 'vee-validate';
import { required, email, min, max, min_value as minValue } from '@vee-validate/rules';

export const setupValidation = () => {
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('max', max);
  defineRule('min_value', minValue);

  configure({
    validateOnInput: true,
    generateMessage: ({ field, rule }) => {
      const messages: Record<string, string> = {
        required: `${field} wajib diisi`,
        email: `${field} harus berupa email yang valid`,
        min: `${field} terlalu pendek`,
        max: `${field} terlalu panjang`,
        min_value: `${field} tidak boleh kurang dari batas minimum`,
      };
      return messages[rule?.name || ''] || `${field} tidak valid`;
    },
  });
};
