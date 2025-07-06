---
layout: default
title: 레고 이벤트 스케쥴러
---

<div class="container">
  <h1 class="page-title">{{ page.title }}</h1>

  {% assign current_year_month_str = 'now' | date: "%Y-%m" %}
  {% assign current_year = 'now' | date: "%Y" | plus: 0 %}
  {% assign current_month_num = 'now' | date: "%-m" | plus: 0 %}

  {% comment %}현재 월의 총 일수 구하기 - Jekyll/Liquid에서는 직접적인 date 함수가 부족하므로,
  간단하게는 31일까지 루프를 돌리고, 실제 해당 월의 날짜인지만 체크하거나,
  또는 JavaScript의 도움 없이 정확한 일수를 구하려면 복잡한 로직이 필요합니다.
  여기서는 간단히 1일부터 31일까지 표시하고, CSS로 빈 날짜 셀을 처리하거나,
  또는 JavaScript로 동적으로 생성하는 것을 고려할 수 있습니다.
  가장 간단한 접근으로, 이번 달의 첫날과 다음 달의 첫날을 이용해 일수를 계산하는 시도를 합니다.
  {% endcomment %}

  {% assign first_day_current_month_str = current_year_month_str | append: "-01" %}
  {% assign first_day_current_month_ts = first_day_current_month_str | date: "%s" %}

  {% assign next_month_logic_month = current_month_num | plus: 1 %}
  {% assign next_month_logic_year = current_year %}
  {% if next_month_logic_month > 12 %}
    {% assign next_month_logic_month = 1 %}
    {% assign next_month_logic_year = current_year | plus: 1 %}
  {% endif %}
  {% assign first_day_next_month_str = next_month_logic_year | append: "-" | append: next_month_logic_month | append: "-01" %}
  {% assign first_day_next_month_ts = first_day_next_month_str | date: "%s" %}

  {% assign seconds_in_day = 86400 %}
  {% assign days_in_current_month = first_day_next_month_ts | minus: first_day_current_month_ts | divided_by: seconds_in_day %}


  <!-- 월간 그리드 테이블 섹션 -->
  <section class="timeline-section">
    <h2>{{ current_year }}년 {{ current_month_num }}월 이벤트 그리드</h2>
    <div class="monthly-grid-scrollable">
      <table class="monthly-grid">
        <thead>
          <tr>
            <th class="date-header">날짜</th>
            {% for site_col in site.data.sites %}
              {% if site_col.id == 1 or site_col.id == 2 or site_col.id == 3 %}
                <th>{{ site_col.name }}</th>
              {% endif %}
            {% endfor %}
          </tr>
        </thead>
        <tbody>
          {% for day_num in (1..days_in_current_month) %}
            <tr>
              <td class="date-cell">{{ day_num }}일</td>
              {% for site_col in site.data.sites %}
                {% if site_col.id == 1 or site_col.id == 2 or site_col.id == 3 %}
                  <td class="event-cell">
                    {% assign events_on_this_day_for_site = "" %}
                    {% assign event_count_for_cell = 0 %}
                    {% for event in site.data.events %}
                      {% if event.site_id == site_col.id %}
                        {% assign event_start_ts = event.start_date | date: "%s" %}
                        {% assign event_end_ts = event.end_date | date: "%s" %}
                        {% assign current_day_str = current_year | append: "-" | append: current_month_num | append: "-" | append: day_num %}
                        {% assign current_day_ts = current_day_str | date: "%s" %}

                        {% if event_start_ts <= current_day_ts and event_end_ts >= current_day_ts %}
                          {% if event_count_for_cell > 0 %}
                            {% assign events_on_this_day_for_site = events_on_this_day_for_site | append: "<br>" %}
                          {% endif %}
                          {% assign events_on_this_day_for_site = events_on_this_day_for_site | append: event.name %}
                          {% assign event_count_for_cell = event_count_for_cell | plus: 1 %}
                        {% endif %}
                      {% endif %}
                    {% endfor %}
                    {{ events_on_this_day_for_site | default: "-" }}
                  </td>
                {% endif %}
              {% endfor %}
            </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  </section>
</div>
