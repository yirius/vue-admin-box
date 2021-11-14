// @ts-ignore
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import i18n from '@/locale';

const { t } = i18n.global;
const { toClipboard } = useClipboard();

export function copyText(text: string) {
    return new Promise((resolve, reject) => {
        try {
            //复制
            toClipboard(text);
            //下面可以设置复制成功的提示框等操作
            ElMessage.success(t('sys.layout.copyTextSuccess'));
            resolve(text);
        } catch (e) {
            //复制失败
            ElMessage.error(t('sys.layout.copyTextError'));
            reject(e);
        }
    });
}