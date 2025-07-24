import type { TextId } from "@/text/text.js";
import { AText, br, large, param, type PFormattedText, pointText, small } from "@/util/format.js";
import OmegaNum from "omega_num.js";

export const text_zh_impl = {
    'default': '文字缺失, 请反馈 bug.',

    'sidebar.title': '菜单',
    'tab-group.Point': pointText('点数'),
    'tab-group.Stats': '统计数据',
    'tab-group.Settings': '设置',
    'tab.Point': pointText('点数'),
    'tab.StatsRecords': '纪录',
    'tab.Settings': '设置',

    'autosave.never': '从未进行自动存档',
    'autosave.time': ['距离上次自动存档: ', param('time'), '.'],

    'time.s': [param('s'), ' 秒'],
    'time.min': [param('min'), ' 分 ', param('s'), ' 秒'],
    'time.h': [param('h'), ' 小时 ', param('min'), ' 分 ', param('s'), ' 秒'],
    'time.d': [param('d'), ' 天 ', param('h'), ' 小时 ', param(' min '), ' 分'],
    'time.y': [param('y'), ' 年'],

    'header.point': ['你当前有 ', pointText(large(param('amount'))), ' ', pointText('点数.')],
    'endgame-condition': ['当前胜利条件: 购买 AU22 (解锁 ', AText('A 挑战'), ').'],

    'pU11.description': ['每秒获得 1 个', pointText('点数'), '.'],
    'pU12.description': ['将获得的', pointText('点数'), ' ×3.'],
    'pU13.description': ['基于当前', pointText('点数'),
                         ', 提高获得的', pointText('点数'), '.'],
    'pU13.hidden-description': '×(1+log10(点数))',
    'pU14.description': '解锁可重复购买升级 pB1.',
    'pU15.description': ['解锁 1 级', pointText('加速器'), '与 pB2.'],
    'pU21.description': ['解锁 pB0, 并将获得的', pointText('点数'), ' ×10.'],
    'pU22.description': [
        '解锁 2 级', pointText('加速器'),
        '与 pB3, 并将获得的', pointText('点数'), '×10.'],
    'pU23.description': [
        '解锁 3 级', pointText('加速器'),
        '与 pB4, 并将获得的', pointText('点数'), '×100.'],
    'pU24.description': ['将获得的', pointText('点数'), ' ×1e6.'],
    'pU25.description': '解锁一个新的重置层级.',
    'pU25.description-after-unlock': ['解锁 ', AText('A'), '.'],

    'Point.booster-amount-description': [
        '你当前有 ', pointText(param('amount')), ' 个 ',
        param('level'), ' 级', pointText('加速器'), '.'],

    'pB1.description': ['将获得的', pointText('点数'), ' ×2.'],
    'pB2.description': ['将获得的 1 级', pointText('加速器'), ' ×2.'],
    'pB3.description': ['将获得的 2 级', pointText('加速器'), ' ×2.'],
    'pB4.description': ['将获得的 3 级', pointText('加速器'), ' ×2.'],
    'pB0.description': [
        '将获得的', pointText('点数'), '与所有', pointText('加速器'), ' ×1.1.'],

    'effect.simple-add': small(['当前效果: +', param('effect')]),
    'effect.simple-mul': small(['当前效果: ×', param('effect')]),

    'price.point': small(['价格: ', param('price'), ' ', pointText('点数'), '.']),
    'price.point-buyable': small(small([
        '价格 (', param('count'), '): ', param('price'), ' ', pointText('点数'), '.'])),

    'hotkey.should-alnum': '快捷键必须为数字或字母.',
    'hotkey.occupied': ['当前快捷键已被占用: ', param('target'), ', 是否强制设置?'],
    'hotkey.none': '无',
    'hotkey.hold-trigger': '触发快捷键功能',

    'hotkey.point-buyable': ['购买所有 pB (', pointText('点数'), '可重复购买升级)'],

    'hint.hold-shift': '部分按钮可以通过长按 Shift 或 Ctrl 以查看未显示的额外信息.',
    'hint.mouse-trigger-hotkey': '鼠标单击或长按快捷键右侧的按钮, 等效于单击或长按快捷键.',

    'settings.confirm': '确认',
    'settings.cancel': '取消',
    'settings.manual-autosave': '手动触发自动保存',
    'settings.save': '存档',
    'settings.load': '读档',
    'settings.delete': '删除',
    'settings.new': '新建',
    'settings.export': '导出存档',
    'settings.export.success': '存档已成功导出到剪贴板!',
    'settings.export.failure': '无法将存档导出到剪贴板.',
    'settings.import': '导入存档',
    'settings.import.wrong-format': '无法识别存档格式!',
    'settings.import.parse-error': '导入存档时发生错误!',
    'settings.import.success': '存档导入成功!',
    'settings.save-load': '存档/读档',
    'settings.save-load.should-select-slot': '请先选择存档栏位.',
    'settings.save.success': ['成功保存到栏位 ', param('slot')],
    'settings.save.failure': ['保存到栏位 ', param('slot'), ' 失败.'],
    'settings.load.success': ['成功读取栏位 ', param('slot')],
    'settings.load.failure': ['读取栏位 ', param('slot'), ' 失败.'],
    'settings.delete.confirm': ['确认删除栏位 ', param('slot'), ' 吗?'],
    'settings.delete.success': ['成功删除栏位 ', param('slot')],
    'settings.new.instruction': '请输入新栏位名称.',
    'settings.new.illegal-name': '该名称含有非法字符, 请重新输入.',
    'settings.new.success': '添加新栏位成功!',

    'stats.historical': '历史总数据',
    'stats.point.gameTime': ['当前游玩时间: ', param('point.gameTime')],
    'stats.point.points': ['最高', pointText('点数'), ': ', pointText(param('point.points'))],

    'tab-group.A': AText('A'),
    'tab.A': AText('A'),

    'A.amount': ['你当前有 ', AText(large(param('amount'))), ' 个 ', AText('A'), '.'],
    'A.reset-time': ['你进行了 ', AText(param('times')), ' 次 ', AText('A'), ' 重置.'],
    'A.reset.description': [
        '进行 ', AText('A'), ' 重置, 获得 ',
        AText(param('points')), ' 个 ', AText('A'), '.'],
    'A.reset.description-not-unlocked': [
        '需要 ', new OmegaNum("1e80"), ' ', pointText('点数'), '.'],
    'A.reset.hidden-description': small([
        '获得 ', AText(param('points')), ' 个 ', AText('A'), ',', br(),
        '获得 ', AText(param('times')), ' 次 ', AText('A'), ' 重置次数.']),

    'AU11.description': ['依据已经游玩的时间, 大幅提高', pointText('点数'), '获取.'],
    'AU11.hidden-description': '×(1+log10(时间))^3',
    'AU12.description': [
        '依据重置 ', AText('A'), ' 的次数, 提高获得的',
        pointText('点数'), '与所有', pointText('推进器'), '.'],
    'AU12.hidden-description': '×(1+A重置次数)',
    'AU13.description': [
        '基于未使用的 ', AText('A'), ', 提高获得的',
        pointText('点数'), '与所有', pointText('推进器'), '.'],
    'AU13.hidden-description': '×(1+log10(1+A))^3',
    'AU14.description': '解锁 pU31.',
    'AU15.description': ['永久解锁购买所有', pointText('推进器'),
                         '的快捷键. 推荐尽早购买以保护鼠标左键耐久度.'],
    'AU21.description': ['解锁 pU32. 此外, 在', pointText('点数'),
                         '足够时, 自动免费解锁', pointText('点数'), '升级.'],
    'AU22.description': ['解锁 ', AText('A 挑战'), ' (TODO).'],
    // 'AU22.description': '解锁 2 级加速器与 pB3, 并将获得的点数 ×10.',
    // 'AU23.description': '解锁 3 级加速器与 pB4, 并将获得的点数 ×100.',
    // 'AU24.description': '将获得的点数 ×1e6.',
    // 'AU25.description': '解锁一个新的重置层级.',

    'pU31.description': [
        '解锁 4 级', pointText('加速器'),
        '与 pB5, 并将获得的', pointText('点数'), '×1000.'],
    'pU32.description': [
        '解锁 5 级', pointText('加速器'),
        '与 pB6, 并将获得的', pointText('点数'), '×1e5.'],
    'pB5.description': ['将获得的 4 级', pointText('加速器'), ' ×2.'],
    'pB6.description': ['将获得的 5 级', pointText('加速器'), ' ×2.'],

    'price.A': small(['价格: ', param('price'), ' ', AText('A'), '.']),
    'price.A-buyable': small([
        '价格 (', param('count'), '): ', param('price'), ' ', AText('A'), '.']),

    'stats.A': ['最近一次 ', AText('A'), ' 重置以来:'],
    'stats.A.resetTimes': ['进行 ', AText('A'), ' 重置次数: ', AText(param('A.resetTimes'))],
    'stats.A.points': ['最高 ', AText('A'), ' 数量: ', AText(param('A.points'))],

    'hint.reset-A-twice': ['通过一次重置获得 1.1 ', AText('A'), ' 看起来非常困难 (耗时). ',
                           '然而, 若愿意进行两次重置, 则事情就简单许多, 但需要更多手动操作. ',
                           '如何选择呢?'],

    'hotkey.A-reset': ['进行 ', AText('A'), ' 重置'],
} satisfies Record<string, PFormattedText>;

export const text_zh: Record<TextId, PFormattedText> = text_zh_impl;