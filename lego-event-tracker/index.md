---
layout: default
title: 레고 이벤트 정보 타임라인
---

<div class="container">
  <h1 class="page-title">{{ page.title }}</h1>

  {% assign current_year = 'now' | date: "%Y" %}

  <!-- 연간 타임라인 섹션 -->
  <section class="timeline-section">
    <h2>{{ current_year }}년 연간 이벤트 현황</h2>
    <div class="annual-timeline-scrollable">
      <table class="annual-timeline">
        <thead>
          <tr>
            <th class="site-name-header">사이트</th>
            {% for month_num in (1..12) %}
              <th>{{ month_num }}월</th>
            {% endfor %}
          </tr>
        </thead>
        <tbody>
          {% for site in site.data.sites %}
            <tr>
              <td class="site-name">{{ site.name }}</td>
              {% for month_num in (1..12) %}
                {% assign month_has_event = false %}
                {% assign event_details_in_month = "" %}
                {% for event in site.data.events %}
                  {% if event.site_id == site.id %}
                    {% assign event_start_date = event.start_date | date: "%s" | plus: 0 %}
                    {% assign event_end_date = event.end_date | date: "%s" | plus: 0 %}

                    {% assign current_month_start_str = current_year | append: "-" | append: month_num | append: "-01" %}
                    {% assign current_month_start = current_month_start_str | date: "%s" | plus: 0 %}

                    {% assign temp_next_month_num = month_num | plus: 1 %}
                    {% assign temp_year_for_next_month = current_year %}
                    {% if temp_next_month_num > 12 %}
                        {% assign temp_next_month_num = 1 %}
                        {% assign temp_year_for_next_month = current_year | plus: 1 %}
                    {% endif %}
                    {% assign next_month_start_str = temp_year_for_next_month | append: "-" | append: temp_next_month_num | append: "-01" %}
                    {% assign next_month_start = next_month_start_str | date: "%s" | plus: 0 %}
                    {% assign current_month_end = next_month_start | minus: 86400 %}


                    {% if event_start_date <= current_month_end and event_end_date >= current_month_start %}
                      {% assign month_has_event = true %}
                      {% assign event_details_in_month = event_details_in_month | append: event.name | append: " (" | append: event.benefit | append: "), " %}
                    {% endif %}
                  {% endif %}
                {% endfor %}
                <td class="month-cell">
                  {% if month_has_event %}
                    <span class="event-marker" title="{{ event_details_in_month | remove_last: ", " }}">●</span>
                  {% else %}
                    -
                  {% endif %}
                </td>
              {% endfor %}
            </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  </section>

  <!-- 상세 타임라인 섹션 (2개월치) -->
  {% assign current_month_num = 'now' | date: "%-m" | plus: 0 %}
  {% assign next_month_num_temp = current_month_num | plus: 1 %}
  {% assign year_for_next_month = current_year %}
  {% if next_month_num_temp > 12 %}
    {% assign next_month_num = 1 %}
    {% assign year_for_next_month = current_year | plus: 1 %}
  {% else %}
    {% assign next_month_num = next_month_num_temp %}
  {% endif %}

  <section class="timeline-section">
    <h2>{{ current_year }}년 {{ current_month_num }}월 - {{ year_for_next_month }}년 {{ next_month_num }}월 상세 현황 (구현 예정)</h2>
    <p>이 부분에는 캘린더 스타일의 상세 뷰와 리스트 뷰가 표시됩니다.</p>
    <!-- 캘린더 및 리스트 뷰 구현은 복잡하여 단계적으로 추가하거나 단순화 필요 -->
    <!-- 예시: 리스트 뷰 -->
    <div class="detailed-list">
      <h3>이벤트 리스트 ({{ current_month_num }}월 - {{ next_month_num }}월)</h3>
      <ul>
        {% for event in site.data.events %}
          {% assign event_start_month = event.start_date | date: "%-m" | plus: 0 %}
          {% assign event_start_year = event.start_date | date: "%Y" | plus: 0 %}
          {% assign event_end_month = event.end_date | date: "%-m" | plus: 0 %}
          {% assign event_end_year = event.end_date | date: "%Y" | plus: 0 %}

          {% comment %}
            현재 월 또는 다음 월에 시작하거나, 현재 월 또는 다음 월에 종료하거나,
            현재 월 또는 다음 월을 포함하여 진행 중인 이벤트
          {% endcomment %}
          {% assign display_event = false %}
          {% if event_start_year == current_year and event_start_month == current_month_num %}
            {% assign display_event = true %}
          {% elsif event_start_year == year_for_next_month and event_start_month == next_month_num %}
            {% assign display_event = true %}
          {% elsif event_end_year == current_year and event_end_month == current_month_num %}
            {% assign display_event = true %}
          {% elsif event_end_year == year_for_next_month and event_end_month == next_month_num %}
            {% assign display_event = true %}
          {% elsif event_start_date < ('now' | date: "%s") and event_end_date > ('now' | date: "%s") %}
            {% assign event_start_ts = event.start_date | date: "%s" %}
            {% assign event_end_ts = event.end_date | date: "%s" %}
            {% assign current_period_start_str = current_year | append: "-" | append: current_month_num | append: "-01" %}
            {% assign current_period_start_ts = current_period_start_str | date: "%s" %}

            {% assign next_period_month_num_temp = next_month_num | plus: 1 %}
            {% assign next_period_year_for_next_month = year_for_next_month %}
            {% if next_period_month_num_temp > 12 %}
                {% assign next_period_month_num = 1 %}
                {% assign next_period_year_for_next_month = year_for_next_month | plus: 1 %}
            {% else %}
                {% assign next_period_month_num = next_period_month_num_temp %}
            {% endif %}
            {% assign next_period_end_str = next_period_year_for_next_month | append: "-" | append: next_period_month_num | append: "-01" %}
            {% assign next_period_end_ts = next_period_end_str | date: "%s" | minus: 1 %}


            {% if event_start_ts <= next_period_end_ts and event_end_ts >= current_period_start_ts %}
                {% assign display_event = true %}
            {% endif %}
          {% endif %}


          {% if display_event %}
            {% assign site_name = "알 수 없는 사이트" %}
            {% for site_item in site.data.sites %}
              {% if site_item.id == event.site_id %}
                {% assign site_name = site_item.name %}
                {% break %}
              {% endif %}
            {% endfor %}
            <li>
              <strong>{{ event.name }}</strong> ({{ site_name }})
              <br>
              기간: {{ event.start_date | date: "%Y.%m.%d" }} ~ {{ event.end_date | date: "%Y.%m.%d" }}
              <br>
              혜택: {{ event.benefit }}
              {% if event.url %}
                | <a href="{{ event.url }}" target="_blank" rel="noopener noreferrer">바로가기</a>
              {% endif %}
            </li>
          {% endif %}
        {% endfor %}
      </ul>
    </div>

  </section>
</div>
