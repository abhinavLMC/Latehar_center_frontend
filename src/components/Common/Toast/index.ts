import { notification } from 'antd'
import type { NotificationPlacement } from 'antd/es/notification/interface'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

const openNotificationWithIcon = (type: NotificationType, title: string, description: string, className?: string, placement?: NotificationPlacement): void => {
  notification[type]({
    message: title,
    description,
    className: `notify-box ${className ?? ''}`,
    placement: placement ?? 'top',
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Toast = (
  type: NotificationType,
  title: string,
  description: string,
  className?: string,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  placement?: NotificationPlacement) => { openNotificationWithIcon(type, title, description, className, placement) }

export default Toast